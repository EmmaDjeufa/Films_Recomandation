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

router.get('/popular', getPopularFilms);
router.get('/top-rated', getTopRatedFilms);
router.get('/upcoming', getUpcomingFilms);
router.get('/search', searchMovies);
router.get('/search/actor', searchActor);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/:id', getMovieDetails);

// Protection uniquement après
router.use(authMiddleware);

router.get('/recommendations', recommendFilms);

router.get('/favorites', getFavorites);

router.post('/favorites', addFavorite);

router.delete('/favorites/:id', removeFavorite);


module.exports = router;