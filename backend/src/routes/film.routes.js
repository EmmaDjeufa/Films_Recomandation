const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { addFilm, recommendFilms } = require('../controllers/film.controller');

router.use(authMiddleware);

router.get('/recommendations', recommendFilms);
router.post('/', adminMiddleware, addFilm); // admin ajoute film

module.exports = router;
