const express = require("express");
const router = express.Router();
//impoort middlewares
const { requireSignin, authMiddleware } = require("../helpers/auth");
//import controllers
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  LikeDislikeQuestion,
} = require("../controllers/question");
// import validator

//Routes
router.post("/:id", requireSignin, authMiddleware, createQuestion);
router.put("/:id", requireSignin, authMiddleware, updateQuestion);
router.delete("/:id", requireSignin, authMiddleware, deleteQuestion);
router.post("/:id/like", requireSignin, authMiddleware, LikeDislikeQuestion);

module.exports = router;
