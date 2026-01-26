const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const upload = multer(); // pour parser fichier multipart/form-data
const { updateProfile, updateThemes, listUsers } = require('../controllers/user.controller');

router.use(authMiddleware);

router.put('/profile', upload.single('photo'), updateProfile);
router.put('/themes', updateThemes);
router.get('/all', listUsers);

module.exports = router;
