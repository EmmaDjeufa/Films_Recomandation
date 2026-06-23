// backend/src/models/User.js

const pool = require('../config/db');

const User = {

  create: async ({ email, password_hash, name }) => {
    const result = await pool.query(
      `
      INSERT INTO users
      (email, password_hash, name, role, is_verified)
      VALUES ($1,$2,$3,'user',false)
      RETURNING *
      `,
      [email, password_hash, name]
    );

    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0];
  },

  verifyEmail: async (id) => {
    const result = await pool.query(
      `
      UPDATE users
      SET is_verified = true
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },

  updateProfile: async (id, { name, photo_url, password_hash }) => {

    const result = await pool.query(
      `
      UPDATE users
      SET
        name = COALESCE($1, name),
        photo_url = COALESCE($2, photo_url),
        password_hash = COALESCE($3, password_hash)
      WHERE id = $4
      RETURNING *
      `,
      [name, photo_url, password_hash, id]
    );

    return result.rows[0];
  },

  getAll: async () => {
    const result = await pool.query(
      `
      SELECT
      id,
      name,
      email,
      photo_url,
      role
      FROM users
      `
    );

    return result.rows;
  }
};

module.exports = User;