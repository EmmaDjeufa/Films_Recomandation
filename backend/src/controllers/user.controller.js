const bcrypt = require('bcrypt');
const User = require('../models/User');
const pool = require('../config/db');
const { uploadProfilePhoto } = require('../utils/supabase');

// Modifier le profil
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;

    let password_hash;
    if (password) password_hash = await bcrypt.hash(password, 10);
    else password_hash = undefined;

    let photo_url;
    if (req.file) {
      // Upload sur Supabase
      photo_url = await uploadProfilePhoto(req.file.buffer, `${userId}-${Date.now()}`, req.file.mimetype);
    }

    const updatedUser = await User.updateProfile(userId, { name, password_hash, photo_url });
    res.json({ message: 'Profil mis à jour', user: updatedUser });
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
      SELECT u.id, u.name, u.photo_url, array_agg(t.name) AS themes,
      COUNT(t.id) AS common_themes
      FROM users u
      LEFT JOIN user_themes ut ON u.id = ut.user_id
      LEFT JOIN themes t ON ut.theme_id = t.id
      WHERE u.id != $1
      GROUP BY u.id
      ORDER BY common_themes DESC
    `, [userId]);

    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateProfile, updateThemes, listUsers };
