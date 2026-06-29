// backend/src/models/User.js
const pool = require('../config/db');

const User = {

  // ==========================
  // Création d'un utilisateur
  // ==========================
  create: async ({
    email,
    password_hash,
    name,
    verification_code,
    verification_expires
  }) => {

    const result = await pool.query(
      `
      INSERT INTO users (
        email,
        password_hash,
        name,
        role,
        is_verified,
        verification_code,
        verification_expires
      )
      VALUES (
        $1,
        $2,
        $3,
        'user',
        false,
        $4,
        $5
      )
      RETURNING *;
      `,
      [
        email,
        password_hash,
        name,
        verification_code,
        verification_expires
      ]
    );

    return result.rows[0];
  },

  // ==========================
  // Recherche par email
  // ==========================
  findByEmail: async (email) => {

    const result = await pool.query(

      `SELECT * FROM users WHERE email=$1`,

      [email]

    );

    return result.rows[0];
  },

  // ==========================
  // Recherche par id
  // ==========================
  findById: async (id) => {

    const result = await pool.query(

      `SELECT * FROM users WHERE id=$1`,

      [id]

    );

    return result.rows[0];
  },

  // ==========================
  // Validation du compte
  // ==========================
  verifyEmail: async (id) => {

    const result = await pool.query(
      `
      UPDATE users
      SET

        is_verified = true,

        verification_code = NULL,

        verification_expires = NULL

      WHERE id = $1

      RETURNING *;
      `,
      [id]
    );

    return result.rows[0];
  },

  // ==========================
  // Mise à jour profil
  // ==========================
  updateProfile: async (
    id,
    {
      name,
      photo_url,
      password_hash
    }
  ) => {

    const result = await pool.query(
      `
      UPDATE users
      SET

      name = COALESCE($1,name),

      photo_url = COALESCE($2,photo_url),

      password_hash = COALESCE($3,password_hash)

      WHERE id=$4

      RETURNING *;
      `,
      [
        name,
        photo_url,
        password_hash,
        id
      ]
    );

    return result.rows[0];
  },

  // ==========================
  // Liste des utilisateurs
  // ==========================
  getAll: async () => {

    const result = await pool.query(
      `
      SELECT

      id,

      name,

      email,

      photo_url,

      role,

      is_verified

      FROM users

      ORDER BY name;
      `
    );

    return result.rows;
  }

};

module.exports = User;