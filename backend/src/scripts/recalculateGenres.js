const pool = require('../config/db');
const tmdb = require('../services/tmdb.service');


const fixGenres = async()=>{


const favorites =
await pool.query(

`
SELECT id, tmdb_id

FROM favorite_movies

WHERE genres IS NULL

`

);



console.log(
"Films à corriger:",
favorites.rows.length
);



for(const film of favorites.rows){


try{


const response =
await tmdb.get(`/movie/${film.tmdb_id}`);



const genres =
response.data.genres.map(
g=>g.id
);



await pool.query(

`
UPDATE favorite_movies

SET genres=$1::integer[]

WHERE id=$2

`,

[
genres,
film.id
]

);



console.log(
"corrigé",
film.tmdb_id,
genres
);



}
catch(err){

console.error(
"Erreur film",
film.tmdb_id,
err.message
);

}


}



process.exit();

};



fixGenres();