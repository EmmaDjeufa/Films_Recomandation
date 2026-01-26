const pool = require('../config/db');

const Theme = {
  create: async (name) => {
    const res = await pool.query('INSERT INTO themes(name) VALUES($1) RETURNING *', [name]);
    return res.rows[0];
  },

  findAll: async () => {
    const res = await pool.query('SELECT * FROM themes ORDER BY name ASC');
    return res.rows;
  },

  findById: async (id) => {
    const res = await pool.query('SELECT * FROM themes WHERE id=$1', [id]);
    return res.rows[0];
  }
};

module.exports = Theme;
