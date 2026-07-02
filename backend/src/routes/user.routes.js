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
  getMyProfile,
  updatePassword,
  getUserById
} = require('../controllers/user.controller');

router.use(authMiddleware);

// Profil
router.get('/me', getMyProfile);

// Update profil (photo + name)
router.put('/profile', upload.single('photo'), updateProfile);

// Password
router.put('/password', updatePassword);

// Themes
router.put('/themes', updateThemes);

// Users list
router.get('/all', listUsers);
router.get('/:id', getUserById);

module.exports = router;