const express = require("express");
const router = express.Router();

//Routes
const UserRoutes = require("./user");
const TopicRoutes = require("./topic");
const QuestionRoutes = require("./question");
const AnswerRoutes = require("./answer");
//middlewares
router.use("/user", UserRoutes);
router.use("/topics", TopicRoutes);
router.use("/questions", QuestionRoutes);
router.use("/answers", AnswerRoutes);

module.exports = router;
