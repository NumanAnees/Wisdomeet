const express = require("express");
const router = express.Router();
//impoort middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../helpers/auth");
//import controllers
const { register, login, update, deleteUser } = require("../controllers/user");
// import validator
const {
  userUpdateValidator,
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/user");
const { runValidation } = require("../validators");

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/login", userLoginValidator, runValidation, login);
router.put(
  "/update",
  requireSignin,
  authMiddleware,
  userUpdateValidator,
  runValidation,
  update
);
router.delete("/delete/:id", requireSignin, adminMiddleware, deleteUser);

module.exports = router;