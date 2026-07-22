//film.controller.js
const tmdb = require('../services/tmdb.service');
const pool = require('../config/db');
const {updateUserThemeStats}=require('../services/themeScore.service');

// =====================
// TMDB FILMS
// =====================


const safeUserId = (req) => {
  if (!req.user || !req.user.id) {
    throw new Error("User not authenticated");
  }
  return req.user.id;
};
const getUserFavoriteThemes = async(userId)=>{

  const result = await pool.query(
    `
    SELECT
      tg.theme_id,
      COUNT(*) AS total

    FROM favorite_movies fm

    JOIN tmdb_genres tg

    ON tg.tmdb_genre_id = ANY(fm.genres)

    WHERE fm.user_id=$1

    GROUP BY tg.theme_id

    ORDER BY total DESC

    `,
    [userId]
  );


  return result.rows;

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

    const {
      tmdb_id,
      title,
      poster_path,
      genres
    }=req.body;


    let movieGenres = genres;


    if(!movieGenres || !movieGenres.length){

      const movie =
      await tmdb.get(`/movie/${tmdb_id}`);


      movieGenres =
      movie.data.genres.map(g=>g.id);

    }

    await pool.query(

      `
      INSERT INTO favorite_movies
      (
      user_id,
      tmdb_id,
      title,
      poster_path,
      genres
      )

      VALUES
      ($1,$2,$3,$4,$5::integer[])

      `,

      [
        userId,
        tmdb_id,
        title,
        poster_path,
        movieGenres
      ]

      );
      await updateUserThemeStats(userId);
      await updateCinemaScore(userId);

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
    // recalcul thèmes après suppression
    await updateUserThemeStats(userId);
    // recalcul score après suppression
    await updateCinemaScore(userId);

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

const recommendFilms = async(req,res)=>{


  try{


  const userId=req.user.id;



  console.log(
  "[RECOMMENDATIONS USER]",
  userId
  );



  // récupérer les thèmes dominants

  const themes =
  await getUserFavoriteThemes(userId);



  if(!themes.length){


  const response =
  await tmdb.get("/movie/popular");


  return res.json(
  response.data.results
  );


  }



  // prendre les 3 meilleurs genres

  const bestThemes =
  themes
  .slice(0,3)
  .map(t=>t.theme_id);




  const genres =
  await pool.query(

  `
  SELECT tmdb_genre_id

  FROM tmdb_genres

  WHERE theme_id = ANY($1)

  `,

  [bestThemes]

  );



  const genreIds =
  genres.rows
  .map(g=>g.tmdb_genre_id)
  .join(",");




  console.log(
  "[RECOMMEND GENRES]",
  genreIds
  );



  const response =
  await tmdb.get(
  "/discover/movie",
  {

  params:{

  with_genres:genreIds,

  sort_by:"popularity.desc"

  }

  }
  );



  res.json(
  response.data.results
  );



  }
  catch(err){


  console.error(
  "[RECOMMEND ERROR]",
  err
  );


  res.status(500)
  .json({
  message:err.message
  });


  }


};

const updateCinemaScore = async(userId)=>{


  const result =
  await pool.query(

  `
  SELECT COUNT(*) 

  FROM favorite_movies

  WHERE user_id=$1

  `,
  [userId]

  );



  const favorites =
  parseInt(
  result.rows[0].count
  );



  let score = favorites * 10;



  await pool.query(

  `

  UPDATE users

  SET cinema_score=$1

  WHERE id=$2

  `,

  [
  score,
  userId
  ]

  );



  console.log(
  "[CINEMA SCORE UPDATED]",
  score
  );
  const diversity =
    await pool.query(

    `
    SELECT COUNT(DISTINCT unnest(genres))

    FROM favorite_movies

    WHERE user_id=$1

    `,
    [userId]

    );


    const diversityBonus =
    parseInt(
    diversity.rows[0].count
    )
    *2;

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
    removeFavorite,
    updateCinemaScore
};