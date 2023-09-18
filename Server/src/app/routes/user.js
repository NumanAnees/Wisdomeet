const express = require("express");
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require("../helpers/auth");
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
const { userUpdateValidator, userRegisterValidator, userLoginValidator } = require("../validators/user");
const { runValidation } = require("../validators");

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/login", userLoginValidator, runValidation, login);
router.put("/", requireSignin, authMiddleware, userUpdateValidator, runValidation, update);
router.get("/confirmation/:token", confirmation);
router.delete("/:id", requireSignin, adminMiddleware, deleteUser);
router.get("/questions", requireSignin, authMiddleware, getUserQuestions);
router.get("/about", requireSignin, authMiddleware, about);
router.get("/about/:id", viewProfile);
router.get("/", requireSignin, authMiddleware, search);
router.get("/users", getAllUsers);

module.exports = router;
