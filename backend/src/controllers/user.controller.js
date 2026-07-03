//user.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const pool = require('../config/db');
const { uploadProfilePhoto } = require('../utils/supabase');

// Modifier le profil
const updateProfile = async (req, res) => {
  console.log("🔥 FILE RECEIVED:", req.file);
  console.log("🔥 BODY:", req.body);
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    console.log("🔥 FILE:", req.file);
    console.log("🔥 BODY:", req.body);

    let password_hash = null;

    if (password?.length > 0) {
      password_hash = await bcrypt.hash(password, 10);
    }

    let photo_url = null;

    if (req.file?.buffer) {
      photo_url = await uploadProfilePhoto(
        req.file.buffer,
        `${userId}-${Date.now()}`,
        req.file.mimetype
      );
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (password_hash) updateData.password_hash = password_hash;
    if (photo_url) updateData.photo_url = photo_url;

    const updatedUser = await User.updateProfile(userId, updateData);

    return res.json({
      message: "Profil mis à jour",
      user: updatedUser
    });

  } catch (err) {
    console.error("🔥 UPDATE PROFILE ERROR:", err);
    return res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await pool.query(
      `SELECT id, name, email, photo_url, role, is_verified
       FROM users
       WHERE id=$1`,
      [userId]
    );

    const favorites = await pool.query(
      `SELECT * FROM favorite_movies WHERE user_id=$1`,
      [userId]
    );

    res.json({
      user: user.rows[0],
      favorites: favorites.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Mot de passe trop court" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users SET password_hash=$1 WHERE id=$2`,
      [hash, userId]
    );

    res.json({ message: "Mot de passe mis à jour" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter/modifier thèmes préférés
const updateThemes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { themeIds } = req.body; // tableau d'IDs

    // Supprimer anciens thèmes
    await pool.query('DELETE FROM user_themes WHERE user_id=$1', [userId]);

    // Ajouter nouveaux
    const insertPromises = themeIds.map(id =>
      pool.query('INSERT INTO user_themes(user_id, theme_id) VALUES($1,$2)', [userId, id])
    );
    await Promise.all(insertPromises);

    res.json({ message: 'Thèmes mis à jour' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lister autres utilisateurs avec thèmes partagés
const listUsers = async (req, res) => {
  try {

    const userId = req.user.id;

    const users = await pool.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.photo_url,
        u.is_verified
      FROM users u
      ORDER BY u.name ASC
    `);

    // ✅ SI VIDE → éviter crash SQL
    const userIds = users.rows.map(u => u.id);

    if (userIds.length === 0) {
      return res.json([]);
    }

    const themesResult = await pool.query(`
      SELECT ut.user_id, t.name
      FROM user_themes ut
      JOIN themes t ON t.id = ut.theme_id
      WHERE ut.user_id = ANY($1::int[])
    `, [userIds]);

    const themesMap = {};

    themesResult.rows.forEach(row => {
      if (!themesMap[row.user_id]) themesMap[row.user_id] = [];
      themesMap[row.user_id].push(row.name);
    });

    const enriched = users.rows.map(u => ({
      ...u,
      themes: themesMap[u.id] || [],
      common_themes: (themesMap[u.id] || []).length
    }));

    res.json(enriched);

  } catch (err) {
    console.error("LIST USERS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
const getUserById = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        photo_url,
        role,
        is_verified
      FROM users
      WHERE id = $1::int
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const themes = await pool.query(`
      SELECT t.name
      FROM user_themes ut
      JOIN themes t
        ON ut.theme_id = t.id
      WHERE ut.user_id = $1
    `, [req.params.id]);

    res.json({
      ...result.rows[0],
      themes: themes.rows.map(t => t.name)
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: err.message });

  }

};


module.exports = { updateProfile, updateThemes, listUsers, getProfile, getMyProfile, updatePassword, getUserById};
