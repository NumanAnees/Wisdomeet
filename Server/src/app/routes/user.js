const express = require("express");
const router = express.Router();

//controllers
const { register, login } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
