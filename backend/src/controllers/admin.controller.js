const pool = require('../config/db');

// Dashboard admin : stats simples
const dashboard = async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const films = await pool.query('SELECT COUNT(*) FROM films');
    const themes = await pool.query('SELECT COUNT(*) FROM themes');

    res.json({
      total_users: users.rows[0].count,
      total_films: films.rows[0].count,
      total_themes: themes.rows[0].count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { dashboard };
