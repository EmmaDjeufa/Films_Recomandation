//auth.routes.js
const express = require("express");

const router = express.Router();

const {

    register,

    login,

    verifyCode

} = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);

router.post("/verify-code", verifyCode);

module.exports = router;
