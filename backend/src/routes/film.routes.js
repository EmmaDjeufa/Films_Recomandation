const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const {
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

/* =====================
   PUBLIC ROUTES
===================== */

router.get('/popular', getPopularFilms);
router.get('/top-rated', getTopRatedFilms);
router.get('/upcoming', getUpcomingFilms);
router.get('/search', searchMovies);
router.get('/search/actor', searchActor);
router.get('/genre/:genre', getMoviesByGenre);


/* =====================
   PROTECTED ROUTES
===================== */

router.use(authMiddleware);


router.get('/recommendations', recommendFilms);

router.get('/favorites', getFavorites);

router.post('/favorites', addFavorite);

router.delete('/favorites/:id', removeFavorite);


/* =====================
   DETAILS (TOUJOURS EN DERNIER)
===================== */

router.get('/:id', getMovieDetails);

// sécurité forte
router.get('/recommendations', (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}, recommendFilms);

router.get('/favorites', (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}, getFavorites);

router.post('/favorites', (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}, addFavorite);

router.delete('/favorites/:id', (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}, removeFavorite);

module.exports = router;