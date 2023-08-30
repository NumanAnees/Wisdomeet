const express = require("express");
const router = express.Router();

const UserRoutes = require("./user");
//middlewares
router.use("/user", UserRoutes);

module.exports = router;
