// backend/src/controllers/user.controller.js

const bcrypt = require('bcrypt');
const User = require('../models/User');
const pool = require('../config/db');
const { uploadProfilePhoto } = require('../utils/supabase');


// =====================================================
// UPDATE PROFIL (PHOTO + NOM)
// =====================================================

const updateProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    console.log(
      "[UPDATE PROFILE]",
      userId
    );


    const {
      name
    } = req.body;


    let photo_url = null;


    if(req.file){

      photo_url = await uploadProfilePhoto(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        userId
      );

      console.log(
        "[PHOTO URL]",
        photo_url
      );

    }



    const updatedUser =
      await User.updateProfile(
        userId,
        {
          name: name || null,
          photo_url
        }
      );


    res.json({

      message:"Profil mis à jour",

      user:updatedUser

    });


  } catch(err){

    console.error(
      "[UPDATE PROFILE ERROR]",
      err
    );


    res.status(500)
    .json({

      message:err.message

    });

  }

};




// =====================================================
// GET MON PROFIL COMPLET
// =====================================================


const getMyProfile = async(req,res)=>{


try{


const userId=req.user.id;


console.log(
"[PROFILE LOAD]",
userId
);



// USER

const userResult =
await pool.query(

`
SELECT

id,
name,
email,
photo_url,
role,
is_verified,
cinema_score

FROM users

WHERE id=$1

`,
[userId]

);




if(!userResult.rows.length){

return res.status(404)
.json({

message:"Utilisateur introuvable"

});

}




// FAVORIS

const favoritesResult =
await pool.query(

`
SELECT

id,
tmdb_id,
title,
poster_path,
created_at

FROM favorite_movies

WHERE user_id=$1

ORDER BY created_at DESC

LIMIT 30

`,
[userId]

);




// THEMES FAVORIS

const themesResult =
await pool.query(

`
SELECT
    t.id,
    t.name,
    uts.score

FROM user_theme_stats uts

JOIN themes t
ON t.id = uts.theme_id

WHERE uts.user_id = $1

ORDER BY uts.score DESC

LIMIT 5

`,
[userId]

);





// UTILISATEURS COMPATIBLES

const similarUsersResult =
await pool.query(
`
SELECT

u.id,
u.name,
u.photo_url,
u.cinema_score,

COUNT(DISTINCT uts.theme_id) AS common_themes

FROM users u

JOIN user_theme_stats uts
ON uts.user_id = u.id

WHERE

u.id <> $1

AND uts.theme_id IN (

    SELECT theme_id
    FROM user_theme_stats
    WHERE user_id = $1

)

GROUP BY

u.id,
u.name,
u.photo_url,
u.cinema_score

HAVING COUNT(DISTINCT uts.theme_id) > 0

ORDER BY

common_themes DESC,
u.cinema_score DESC

LIMIT 10
`,
[userId]
);






// CLASSEMENT

const rankingResult =

await pool.query(

`

SELECT position

FROM

(

SELECT

id,

RANK()

OVER(
ORDER BY cinema_score DESC
)

AS position


FROM users


)

ranking


WHERE id=$1


`,

[userId]

);





// RECOMMANDATIONS TMDB

const recommendations =
await getRecommendations(userId);

console.log(

"[PROFILE SUCCESS]",

{

favorites:favoritesResult.rows.length,

themes:themesResult.rows.length,

similarUsers:similarUsersResult.rows.length

}

);




res.json({

user:userResult.rows[0],

favorites:favoritesResult.rows,

themes:themesResult.rows,

similarUsers:similarUsersResult.rows,

ranking:
rankingResult.rows[0]?.position || null,

recommendations


});



}catch(err){


console.error(
"[PROFILE ERROR]",
err
);


res.status(500)
.json({

message:err.message

});


}


};









// =====================================================
// RECOMMANDATIONS BASEES SUR THEMES
// =====================================================


const getRecommendations = async(userId)=>{


  try{


  const themes = await pool.query(

  `
  SELECT
  tg.tmdb_genre_id

  FROM user_theme_stats uts

  JOIN tmdb_genres tg

  ON tg.theme_id=uts.theme_id

  WHERE uts.user_id=$1

  ORDER BY uts.score DESC

  LIMIT 3
  `,
  [userId]

  );



  if(!themes.rows.length){

  return [];

  }



  const genreIds =
  themes.rows
  .map(g=>g.tmdb_genre_id)
  .join(",");



  const response =
  await require('../services/tmdb.service')
  .get(
  "/discover/movie",
  {
  params:{
  with_genres:genreIds,
  sort_by:"popularity.desc",
  page:1
  }
  }
  );



  return response.data.results.slice(0,10);



  }
  catch(err){

  console.error(
  "[RECOMMENDATION ERROR]",
  err
  );


  return [];

  }


};







// =====================================================
// UPDATE THEMES
// =====================================================


const updateThemes = async(req,res)=>{


try{


const userId=req.user.id;


const {
themeIds
}=req.body;



if(!Array.isArray(themeIds)){

return res.status(400)
.json({

message:"themeIds invalide"

});

}




await pool.query(

`
DELETE FROM user_themes

WHERE user_id=$1

`,
[userId]

);





for(const themeId of themeIds){


await pool.query(

`

INSERT INTO user_themes

(user_id,theme_id)

VALUES($1,$2)

ON CONFLICT DO NOTHING

`,

[
userId,
themeId
]

);


}




res.json({

message:"Thèmes mis à jour"

});



}catch(err){


console.error(
"[UPDATE THEMES ERROR]",
err
);


res.status(500)
.json({

message:err.message

});


}


};









// =====================================================
// LISTE UTILISATEURS (ADMIN / RECHERCHE)
// =====================================================


const listUsers = async (req, res) => {

  try {

    const limit = Math.min(
      parseInt(req.query.limit) || 20,
      50
    );

    const offset =
      parseInt(req.query.offset) || 0;


    const currentUserId =
      req.user.id;



    const result = await pool.query(
      `

      SELECT

      u.id,
      u.name,
      u.email,
      u.photo_url,
      u.is_verified,
      u.cinema_score,


      COALESCE(

        ARRAY_AGG(DISTINCT t.name)
        FILTER(
          WHERE t.name IS NOT NULL
        ),

        '{}'

      ) AS themes,


      COUNT(
        DISTINCT common.theme_id
      ) AS common_themes


      FROM users u



      LEFT JOIN user_theme_stats uts

      ON uts.user_id=u.id



      LEFT JOIN themes t

      ON t.id=uts.theme_id




      LEFT JOIN user_theme_stats common

      ON common.theme_id = uts.theme_id

      AND common.user_id = $3



      GROUP BY

      u.id,
      u.name,
      u.email,
      u.photo_url,
      u.is_verified,
      u.cinema_score



      ORDER BY

      u.cinema_score DESC,
      u.name ASC



      LIMIT $1
      OFFSET $2


      `,

      [
        limit,
        offset,
        currentUserId
      ]

    );


    res.json(result.rows);



  } catch(err){

    console.error(
      "[LIST USERS ERROR]",
      err
    );


    res.status(500).json({

      message:err.message

    });

  }

};








// =====================================================
// GET USER PUBLIC
// =====================================================


const getUserById = async(req,res)=>{


try{


const id=req.params.id;

const currentUserId=req.user.id;



const user=

await pool.query(

`
SELECT

id,
name,
photo_url,
cinema_score

FROM users

WHERE id=$1

`,
[id]

);



if(!user.rows.length){

return res.status(404)
.json({

message:"Utilisateur introuvable"

});

}




const themes=

await pool.query(

`

SELECT

t.name,
uts.score


FROM user_theme_stats uts


JOIN themes t

ON t.id = uts.theme_id


WHERE uts.user_id=$1


ORDER BY uts.score DESC


LIMIT 5


`,

[id]

);




// THEMES COMMUNS

const commonThemes =

await pool.query(

`

SELECT

t.name


FROM user_theme_stats uts


JOIN themes t

ON t.id = uts.theme_id



WHERE

uts.user_id=$1


AND uts.theme_id IN

(

SELECT theme_id

FROM user_theme_stats

WHERE user_id=$2

)


ORDER BY t.name


`,

[
id,
currentUserId
]

);




res.json({

...user.rows[0],

themes:themes.rows,

commonThemes:
commonThemes.rows


});



}catch(err){


console.error(
"[GET USER ERROR]",
err
);


res.status(500)
.json({

message:err.message

});


}


};









// =====================================================
// PASSWORD
// =====================================================


const updatePassword =
async(req,res)=>{


try{


const userId=req.user.id;

const {
password
}=req.body;



if(!password || password.length<6){

return res.status(400)
.json({

message:"Mot de passe trop court"

});

}



const hash =
await bcrypt.hash(password,10);



await pool.query(

`

UPDATE users

SET password_hash=$1

WHERE id=$2

`,

[
hash,
userId
]

);



res.json({

message:"Mot de passe mis à jour"

});



}catch(err){


res.status(500)
.json({

message:err.message

});


}


};





module.exports={

updateProfile,

getMyProfile,

updateThemes,

listUsers,

getUserById,

updatePassword

};