const express = require("express");
const router = express.Router();

const UserRoutes = require("./user");
const TopicRoutes = require("./topic");
const QuestionRoutes = require("./question");
const AnswerRoutes = require("./answer");

router.use("/user", UserRoutes);
router.use("/topics", TopicRoutes);
router.use("/questions", QuestionRoutes);
router.use("/answers", AnswerRoutes);

module.exports = router;
