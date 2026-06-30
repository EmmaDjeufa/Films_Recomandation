//film.controller.js
const tmdb = require('../services/tmdb.service');
const pool = require('../config/db');

// =====================
// TMDB FILMS
// =====================

const getPopularFilms = async (req, res) => {
  try {
    const response = await tmdb.get("/movie/popular");
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTopRatedFilms = async (req, res) => {
  try {
    const response = await tmdb.get("/movie/top_rated");
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUpcomingFilms = async (req, res) => {
  try {
    const response = await tmdb.get("/movie/upcoming");
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    const response = await tmdb.get("/search/movie", {
      params: { query }
    });

    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// FAVORITES
// =====================

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tmdb_id, title, poster_path } = req.body;

    await pool.query(
      `INSERT INTO favorite_movies(user_id, tmdb_id, title, poster_path)
       VALUES ($1,$2,$3,$4)`,
      [userId, tmdb_id, title, poster_path]
    );

    res.json({ message: "Favori ajouté" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM favorite_movies WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM favorite_movies WHERE user_id=$1 AND tmdb_id=$2`,
      [req.user.id, req.params.id]
    );

    res.json({ message: "Supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// RECOMMENDATION
// =====================

const recommendFilms = async (req, res) => {
  try {
    const userId = req.user.id;

    const themes = await pool.query(
      `SELECT theme_id FROM user_themes WHERE user_id=$1`,
      [userId]
    );

    const genreIds = themes.rows.map(t => t.theme_id);

    if (!genreIds.length) {
      const response = await tmdb.get("/movie/popular");
      return res.json(response.data.results);
    }

    const response = await tmdb.get("/discover/movie", {
      params: {
        with_genres: genreIds.join(',')
      }
    });

    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPopularFilms,
  getTopRatedFilms,
  getUpcomingFilms,
  searchMovies,
  addFavorite,
  getFavorites,
  removeFavorite,
  recommendFilms
};