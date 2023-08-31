const expressJwt = require("express-jwt");
const sequelize = require("../../db/db");
const { DataTypes } = require("sequelize");
const User = require("../models/user")(sequelize, DataTypes);

//--------------------------------------Authorization--------------------------------
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
}); // req.user

exports.authMiddleware = async (req, res, next) => {
  const authUserId = req.user.id;
  console.log(req.user);
  const user = await User.findOne({ where: { id: authUserId } });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  req.profile = user;
  next();
};

//-----------------------------------_Admin middleware --------------------------------
exports.adminMiddleware = async (req, res, next) => {
  const adminUserId = req.user.id;
  const user = await User.findOne({ where: { id: adminUserId } });
  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  if (user.role !== "admin") {
    return res.status(400).json({
      error: "Admin resource. Access denied",
    });
  }

  req.profile = user;
  next();
};
