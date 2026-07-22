const pool = require('../config/db');

console.log("THEME SCORE SERVICE CHARGE");


const updateUserThemeStats = async(userId)=>{

try{


console.log(
"[THEME SCORE] recalcul",
userId
);



const favorites = await pool.query(
`
SELECT genres
FROM favorite_movies
WHERE user_id=$1
`,
[userId]
);



await pool.query(
`
DELETE FROM user_theme_stats
WHERE user_id=$1
`,
[userId]
);



if(!favorites.rows.length){

console.log(
"[THEME SCORE] aucun favori"
);

return;

}



const themeScores={};



for(const movie of favorites.rows){


if(!movie.genres){
continue;
}



for(const genreId of movie.genres){



const theme = await pool.query(

`
SELECT theme_id
FROM tmdb_genres
WHERE tmdb_genre_id=$1
`,
[
genreId
]

);



if(!theme.rows.length){
continue;
}



const themeId =
theme.rows[0].theme_id;



themeScores[themeId] =
(themeScores[themeId] || 0) + 10;



}

}




for(const themeId in themeScores){


await pool.query(

`
INSERT INTO user_theme_stats
(
user_id,
theme_id,
score
)

VALUES
($1,$2,$3)
`,
[
userId,
themeId,
themeScores[themeId]
]

);


}



console.log(
"[THEME SCORE OK]",
themeScores
);



}
catch(err){

console.error(
"[THEME SCORE ERROR]",
err
);

throw err;

}


};



module.exports={
updateUserThemeStats
};