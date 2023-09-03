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
  getQuestionsByFollowedTopics,
  getQuestionWithAnswers,
} = require("../controllers/question");
// import validator
const { questionValidator } = require("../validators/question");
const { runValidation } = require("../validators");

//Routes
router.post(
  "/:id",
  requireSignin,
  authMiddleware,
  questionValidator,
  runValidation,
  createQuestion
);
router.put(
  "/:id",
  requireSignin,
  authMiddleware,
  questionValidator,
  runValidation,
  updateQuestion
);
router.delete("/:id", requireSignin, authMiddleware, deleteQuestion);
router.get("/:id", getQuestionWithAnswers);
router.post("/:id/like", requireSignin, authMiddleware, LikeDislikeQuestion);
router.get("/", requireSignin, authMiddleware, getQuestionsByFollowedTopics);

module.exports = router;
