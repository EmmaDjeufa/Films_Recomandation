// backend/src/models/User.js
const pool = require('../config/db');

const User = {

  // ==========================
  // Création utilisateur
  // ==========================
  create: async ({
    email,
    password_hash,
    name,
    verification_code,
    verification_expires
  }) => {

    const result = await pool.query(
      `
      INSERT INTO users (
        email,
        password_hash,
        name,
        role,
        is_verified,
        verification_code,
        verification_expires
      )
      VALUES (
        $1,
        $2,
        $3,
        'user',
        false,
        $4,
        $5
      )
      RETURNING *;
      `,
      [
        email,
        password_hash,
        name,
        verification_code,
        verification_expires
      ]
    );

    return result.rows[0];
  },


  // ==========================
  // Email
  // ==========================
  findByEmail: async (email) => {

    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    return result.rows[0];
  },


  // ==========================
  // ID
  // ==========================
  findById: async (id) => {

    const result = await pool.query(
      `
      SELECT
        id,
        email,
        name,
        role,
        photo_url,
        is_verified,
        cinema_score,
        created_at
      FROM users
      WHERE id=$1
      `,
      [id]
    );

    return result.rows[0];
  },


  // ==========================
  // Vérification email
  // ==========================
  verifyEmail: async (id) => {

    const result = await pool.query(
      `
      UPDATE users
      SET
        is_verified=true,
        verification_code=NULL,
        verification_expires=NULL
      WHERE id=$1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  },


  // ==========================
  // Update profil
  // ==========================
  updateProfile: async (
    id,
    {
      name=null,
      photo_url=null,
      password_hash=null
    }
  ) => {

    const result = await pool.query(
      `
      UPDATE users
      SET

        name = COALESCE($1,name),

        photo_url = COALESCE($2,photo_url),

        password_hash = COALESCE($3,password_hash)

      WHERE id=$4

      RETURNING
        id,
        email,
        name,
        photo_url,
        role,
        cinema_score;

      `,
      [
        name,
        photo_url,
        password_hash,
        id
      ]
    );


    return result.rows[0];

  },


  // ==========================
  // Tous utilisateurs
  // ==========================
  getAll: async () => {

    const result = await pool.query(
      `
      SELECT

        id,
        name,
        photo_url,
        role,
        cinema_score

      FROM users

      ORDER BY cinema_score DESC

      `
    );


    return result.rows;

  },


  // ==========================
  // Classement utilisateur
  // ==========================
  getRanking: async(userId)=>{


    const result = await pool.query(
      `
      SELECT

        (
          SELECT COUNT(*)
          FROM users u2
          WHERE u2.cinema_score > u.cinema_score
        ) + 1 AS position,


        (
          SELECT COUNT(*)
          FROM users
        ) AS total,


        u.cinema_score


      FROM users u

      WHERE u.id=$1

      `,
      [
        userId
      ]
    );


    return result.rows[0];

  },


  // ==========================
  // Utilisateurs similaires
  // ==========================
  getSimilarUsers: async(userId)=>{


    const result = await pool.query(
      `

      SELECT

        u.id,
        u.name,
        u.photo_url,
        COUNT(uts.theme_id) AS common_themes


      FROM user_theme_stats uts


      JOIN user_theme_stats other

      ON other.theme_id = uts.theme_id


      JOIN users u

      ON u.id = other.user_id


      WHERE

        uts.user_id=$1

        AND other.user_id<>$1


      GROUP BY

        u.id


      ORDER BY

        common_themes DESC


      LIMIT 10;


      `,
      [
        userId
      ]
    );


    return result.rows;

  },


  // ==========================
  // Thèmes préférés
  // ==========================
  getPreferredThemes: async(userId)=>{


    const result = await pool.query(
      `
      SELECT

        t.id,

        t.name,

        uts.score


      FROM user_theme_stats uts


      JOIN themes t

      ON t.id=uts.theme_id


      WHERE

        uts.user_id=$1


      ORDER BY

        uts.score DESC


      LIMIT 5;

      `,
      [
        userId
      ]
    );


    return result.rows;

  }

};


module.exports = User;