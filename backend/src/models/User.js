const pool = require('../config/db');

const User = {
  create: async ({ email, password_hash, name }) => {
    const res = await pool.query(
      'INSERT INTO users(email, password_hash, name, role, is_verified, created_at, updated_at) VALUES($1,$2,$3,$4,$5,NOW(),NOW()) RETURNING *',
      [email, password_hash, name, 'user', false]
    );
    return res.rows[0];
  },

  findByEmail: async (email) => {
    const res = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return res.rows[0];
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return res.rows[0];
  },

  verifyEmail: async (id) => {
    const res = await pool.query('UPDATE users SET is_verified=true WHERE id=$1 RETURNING *', [id]);
    return res.rows[0];
  },

  updateProfile: async (id, { name, photo_url, password_hash }) => {
    const res = await pool.query(
      'UPDATE users SET name=$1, photo_url=$2, password_hash=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
      [name, photo_url, password_hash, id]
    );
    return res.rows[0];
  },

  getAll: async () => {
    const res = await pool.query('SELECT id, name, email, photo_url, role FROM users');
    return res.rows;
  },
};

module.exports = User;
