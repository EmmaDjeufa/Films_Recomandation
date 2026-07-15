//film.controller.js
const tmdb = require('../services/tmdb.service');
const pool = require('../config/db');

// =====================
// TMDB FILMS
// =====================

const safeUserId = (req) => {
  if (!req.user || !req.user.id) {
    throw new Error("User not authenticated");
  }
  return req.user.id;
};

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

const searchActor = async (req, res) => {
    try {

        const { query } = req.query;

        const response = await tmdb.get("/search/person", {
            params: {
                query
            }
        });

        res.json(response.data.results);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// =====================
// FAVORITES
// =====================

const addFavorite = async (req, res) => {
  try {
    const userId = safeUserId(req);

    const { tmdb_id, title, poster_path } = req.body;

    await pool.query(
      `INSERT INTO favorite_movies(user_id, tmdb_id, title, poster_path)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT DO NOTHING`,
      [userId, tmdb_id, title, poster_path]
    );

    res.json({ message: "Favori ajouté" });
  } catch (err) {
    console.error("addFavorite error:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

const getFavorites = async (req, res) => {

  console.log("=== GET FAVORITES ===");
  console.log("USER:", req.user);

  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message:"Utilisateur absent"
      });
    }


    const userId = req.user.id;


    const result = await pool.query(
      `
      SELECT 
        id,
        user_id,
        tmdb_id,
        title,
        poster_path,
        created_at
      FROM favorite_movies
      WHERE user_id=$1
      ORDER BY created_at DESC
      `,
      [userId]
    );


    console.log(
      "FAVORITES TROUVES:",
      result.rows.length
    );


    res.json(result.rows);


  } catch(err) {


    console.error(
      "GET FAVORITES ERROR COMPLETE:",
      err
    );


    res.status(500).json({
      message:err.message
    });

  }

};

const removeFavorite = async (req, res) => {

  try {

    const userId = req.user.id;
    const tmdbId = req.params.id;

    console.log("Suppression :", userId, tmdbId);

    const result = await pool.query(
      `DELETE FROM favorite_movies
       WHERE user_id=$1
       AND tmdb_id=$2`,
      [userId, tmdbId]
    );

    console.log(result);

    res.json({ message: "Supprimé" });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Erreur suppression favorite"
    });

  }

};

const getMoviesByGenre = async (req, res) => {

    try {

        const response = await tmdb.get("/discover/movie", {
            params: {
                with_genres: req.params.genre
            }
        });

        res.json(response.data.results);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const getMovieDetails = async (req, res) => {

    try {

        const response = await tmdb.get(
            `/movie/${req.params.id}`
        );

        res.json(response.data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const addFilm = async (req, res) => {

    res.status(501).json({
        message: "Ajout manuel désactivé (TMDb utilisé)."
    });

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
    addFilm,
    getPopularFilms,
    getTopRatedFilms,
    getUpcomingFilms,
    searchMovies,
    searchActor,
    getMoviesByGenre,
    getMovieDetails,
    recommendFilms,
    addFavorite,
    getFavorites,
    removeFavorite
};