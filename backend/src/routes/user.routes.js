//user.routes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const multer = require('multer');

const upload = multer({
  limits:{
    fileSize:5 * 1024 * 1024
  }
});


const {

  updateProfile,
  updateThemes,
  listUsers,
  getMyProfile,
  updatePassword,
  getUserById

} = require('../controllers/user.controller');





router.use(authMiddleware);




// ===============================
// PROFIL CONNECTÉ
// ===============================


router.get(
  '/me',
  getMyProfile
);




// ===============================
// MODIFICATION PROFIL
// ===============================


router.put(

  '/profile',

  upload.single('photo'),

  updateProfile

);




// ===============================
// PASSWORD
// ===============================


router.put(

  '/password',

  updatePassword

);




// ===============================
// THEMES FAVORIS
// ===============================


router.put(

  '/themes',

  updateThemes

);




// ===============================
// UTILISATEURS
// ===============================


// pagination prévue
router.get(

  '/all',

  listUsers

);



// profil public

router.get(

  '/:id',

  getUserById

);





module.exports = router;