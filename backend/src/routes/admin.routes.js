const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const { dashboard } = require('../controllers/admin.controller');

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', dashboard);

module.exports = router;
