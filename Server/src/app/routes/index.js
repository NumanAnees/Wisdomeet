const express = require("express");
const router = express.Router();

//Routes
const UserRoutes = require("./user");
const TopicRoutes = require("./topic");
const QuestionRoutes = require("./question");
const AnswerRoutes = require("./answer");
//middlewares
router.use("/user", UserRoutes);
router.use("/topic", TopicRoutes);
router.use("/question", QuestionRoutes);
router.use("/answer", AnswerRoutes);

module.exports = router;
