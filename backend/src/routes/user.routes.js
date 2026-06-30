//user.routes.js
const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const multer = require('multer');

const upload = multer();

const {

  updateProfile,

  updateThemes,

  listUsers,

  getProfile,

  updatePassword

} = require('../controllers/user.controller');

router.use(authMiddleware);

router.get('/profile', getProfile);

router.put('/profile', upload.single('photo'), updateProfile);

router.put('/password', updatePassword);

router.put('/themes', updateThemes);

router.get('/all', listUsers);

module.exports = router;