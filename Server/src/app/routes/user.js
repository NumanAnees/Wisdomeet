const express = require("express");
const router = express.Router();
//impoort middlewares
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../helpers/auth");
//import controllers
const {
  register,
  login,
  update,
  deleteUser,
  getUserQuestions,
  about,
  viewProfile,
  search,
} = require("../controllers/user");
// import validator
const {
  userUpdateValidator,
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/user");
const { runValidation } = require("../validators");

//Routes
router.post("/register", userRegisterValidator, runValidation, register);
router.post("/login", userLoginValidator, runValidation, login);
router.put(
  "/",
  requireSignin,
  authMiddleware,
  userUpdateValidator,
  runValidation,
  update
);
router.delete("/:id", requireSignin, adminMiddleware, deleteUser);
router.get("/questions", requireSignin, authMiddleware, getUserQuestions);
router.get("/about", requireSignin, authMiddleware, about);
router.get("/about/:id", viewProfile);
router.get("/", search);

module.exports = router;
