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
  getAllUsers,
  confirmation,
} = require("../controllers/user");
// import validator
const {
  userUpdateValidator,
  userRegisterValidator,
  userLoginValidator,
} = require("../validators/user");
const { runValidation } = require("../validators");

//----------------------------Routes----------------------------
// User Registration
router.post("/register", userRegisterValidator, runValidation, register);

// User Login
router.post("/login", userLoginValidator, runValidation, login);

// User Update
router.put(
  "/",
  requireSignin,
  authMiddleware,
  userUpdateValidator,
  runValidation,
  update
);
//User Confirmation
router.get("/confirmation/:token", confirmation);

// User Deletion by admin
router.delete("/:id", requireSignin, adminMiddleware, deleteUser);

// User's Questions
router.get("/questions", requireSignin, authMiddleware, getUserQuestions);

// User's Profile
router.get("/about", requireSignin, authMiddleware, about);

// View User's Profile
router.get("/about/:id", viewProfile);

// Search Users
router.get("/", requireSignin, authMiddleware, search);

// All Users
router.get("/users", getAllUsers);

module.exports = router;
