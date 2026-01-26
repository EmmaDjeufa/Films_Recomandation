const pool = require('../config/db');

const Film = {
  create: async ({ title, description, poster_url, theme_id }) => {
    const res = await pool.query(
      'INSERT INTO films(title, description, poster_url, theme_id) VALUES($1,$2,$3,$4) RETURNING *',
      [title, description, poster_url, theme_id]
    );
    return res.rows[0];
  },

  findAll: async () => {
    const res = await pool.query('SELECT * FROM films');
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM films WHERE id=$1', [id]);
    return res.rows[0];
  },

  findByThemes: async (themeIds) => {
    const res = await pool.query(
      'SELECT * FROM films WHERE theme_id = ANY($1::int[])',
      [themeIds]
    );
    return res.rows;
  }
};

module.exports = Film;
