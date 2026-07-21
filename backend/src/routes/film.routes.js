const express = require('express');
const router = express.Router();

const db = require('../config/db');

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



/*
=====================
PUBLIC
=====================
*/


router.get('/popular', getPopularFilms);

router.get('/top-rated', getTopRatedFilms);

router.get('/upcoming', getUpcomingFilms);


router.get('/search', searchMovies);

router.get('/search/actor', searchActor);


router.get('/genre/:genre', getMoviesByGenre);





/*
=====================
THEMES FILMS
=====================
*/


router.get('/theme/:id', async(req,res)=>{

try {

const themeId = req.params.id;


const result = await db.query(
`
SELECT tmdb_genre_id
FROM tmdb_genres
WHERE theme_id=$1
`,
[
themeId
]
);



if(!result.rows.length){

return res.json([]);

}



const genreId = result.rows[0].tmdb_genre_id;


const url =
`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc&page=1`;



console.log(
"[TMDB THEME URL]",
url
);



const response =
await fetch(url);



const data =
await response.json();



console.log(
"[TMDB RESPONSE]",
{
status:response.status,
genre:genreId,
count:data.results?.length,
error:data.status_message
}
);



if(!response.ok){

return res.status(response.status).json({

message:data.status_message || "TMDB ERROR"

});

}



return res.json(
data.results || []
);



}
catch(error){


console.error(
"[THEME FILMS ERROR]",
error
);


return res.status(500).json({

message:"Erreur chargement thème"

});


}


});

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

router.get('/:id', getMovieDetails);

module.exports = router;