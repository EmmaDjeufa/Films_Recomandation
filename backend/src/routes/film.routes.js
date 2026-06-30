//film.routes.js
// film.routes.js

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const {
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
} = require('../controllers/film.controller');

router.use(authMiddleware);

// =======================
// Films TMDb
// =======================

router.get('/popular', getPopularFilms);

router.get('/top-rated', getTopRatedFilms);

router.get('/upcoming', getUpcomingFilms);

router.get('/search', searchMovies);

router.get('/search/actor', searchActor);

router.get('/genre/:genre', getMoviesByGenre);

router.get('/:id', getMovieDetails);

// =======================
// Recommandations
// =======================

router.get('/recommendations', recommendFilms);

// =======================
// Favoris
// =======================

router.get('/favorites', getFavorites);

router.post('/favorites', addFavorite);

router.delete('/favorites/:id', removeFavorite);

// =======================
// Administration
// =======================



module.exports = router;