const express = require("express");
const router = express.Router();

const { requireSignin, authMiddleware } = require("../helpers/auth");

const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByFollowedTopics,
  getQuestionWithAnswers,
  LikeQuestion,
  DislikeQuestion,
} = require("../controllers/question");

const { questionValidator } = require("../validators/question");
const { runValidation } = require("../validators");

router.post("/:id", requireSignin, authMiddleware, questionValidator, runValidation, createQuestion);
router.put("/:id", requireSignin, authMiddleware, questionValidator, runValidation, updateQuestion);
router.delete("/:id", requireSignin, authMiddleware, deleteQuestion);
router.get("/:id", requireSignin, authMiddleware, getQuestionWithAnswers);
router.post("/:id/like", requireSignin, authMiddleware, LikeQuestion);
router.post("/:id/dislike", requireSignin, authMiddleware, DislikeQuestion);
router.get("/", requireSignin, authMiddleware, getQuestionsByFollowedTopics);

module.exports = router;
