const express = require("express");
const router = express.Router();
//middlewares
const { requireSignin, authMiddleware } = require("../helpers/auth");
//controllers
const { register, login, update } = require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.put("/update", requireSignin, authMiddleware, update);

module.exports = router;
