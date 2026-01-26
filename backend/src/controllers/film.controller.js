const pool = require('../config/db');

// Ajouter un film (admin)
const addFilm = async (req, res) => {
  try {
    const { title, description, poster_url, theme_id } = req.body;
    const result = await pool.query(
      'INSERT INTO films(title, description, poster_url, theme_id) VALUES($1,$2,$3,$4) RETURNING *',
      [title, description, poster_url, theme_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recommandations pour l’utilisateur
const recommendFilms = async (req, res) => {
  try {
    const userId = req.user.id;
    const userThemes = await pool.query('SELECT theme_id FROM user_themes WHERE user_id=$1', [userId]);
    const themeIds = userThemes.rows.map(r => r.theme_id);
    if (!themeIds.length) return res.json([]);

    const films = await pool.query(
      `SELECT * FROM films WHERE theme_id = ANY($1::int[])`,
      [themeIds]
    );

    res.json(films.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addFilm, recommendFilms };
