const express = require("express");
const router = express.Router();
//impoort middlewares
const { requireSignin, authMiddleware } = require("../helpers/auth");
//import controllers
const {
  createAnswer,
  updateAnswer,
  deleteAnswer,
  LikeDislikeAnswer,
} = require("../controllers/answer");
// import validator

//Routes
router.post("/:id", requireSignin, authMiddleware, createAnswer);
router.put("/:id", requireSignin, authMiddleware, updateAnswer);
router.delete("/:id", requireSignin, authMiddleware, deleteAnswer);
router.post("/:id/like", requireSignin, authMiddleware, LikeDislikeAnswer);

module.exports = router;
