const pool = require('../config/db');

const UserTheme = {
  setThemesForUser: async (userId, themeIds) => {
    await pool.query('DELETE FROM user_themes WHERE user_id=$1', [userId]);
    const insertPromises = themeIds.map(id =>
      pool.query('INSERT INTO user_themes(user_id, theme_id) VALUES($1,$2)', [userId, id])
    );
    await Promise.all(insertPromises);
  },

  getThemesForUser: async (userId) => {
    const res = await pool.query(
      'SELECT t.* FROM themes t JOIN user_themes ut ON t.id = ut.theme_id WHERE ut.user_id=$1',
      [userId]
    );
    return res.rows;
  }
};

module.exports = UserTheme;
