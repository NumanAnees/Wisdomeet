const express = require("express");
const router = express.Router();

const { requireSignin, authMiddleware } = require("../helpers/auth");

const { createAnswer, updateAnswer, deleteAnswer, LikeAnswer, DislikeAnswer } = require("../controllers/answer");

const { answerValidator } = require("../validators/answer");
const { runValidation } = require("../validators");

router.post("/:id", requireSignin, authMiddleware, answerValidator, runValidation, createAnswer);
router.put("/:id", requireSignin, authMiddleware, answerValidator, runValidation, updateAnswer);
router.delete("/:id", requireSignin, authMiddleware, deleteAnswer);
router.post("/:id/like", requireSignin, authMiddleware, LikeAnswer);
router.post("/:id/dislike", requireSignin, authMiddleware, DislikeAnswer);

module.exports = router;
