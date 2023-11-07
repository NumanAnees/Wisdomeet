const express = require("express");
const router = express.Router();

//Routes
const UserRoutes = require("./user");
const TopicRoutes = require("./topic");
//middlewares
router.use("/user", UserRoutes);
router.use("/topic", TopicRoutes);

module.exports = router;
