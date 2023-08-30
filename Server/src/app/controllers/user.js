const jwt = require("jsonwebtoken");
const sequelize = require("../../db/db");
const { DataTypes } = require("sequelize");
const User = require("../models/user")(sequelize, DataTypes);
const passport = require("passport");

//-----------------------------Cloudinary---------------------------------
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dhghdtteg",
  api_key: "523389569168828",
  api_secret: "c_SYdsF1M5IauIZrA3PASXbdVl0",
});
//-----------------------------Register--------------------------------
exports.register = async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const imagePath = req.files.picture; //name on postman
    cloudinary.uploader.upload(
      imagePath.tempFilePath,
      async (error, result) => {
        if (error) {
          console.error(error);
        } else {
          //if everything is ok
          console.log(result);
          const profilePic = result.url;
          // Create a new user
          const newUser = await User.create({
            email: email,
            password: password,
            name: name,
            profilePic: profilePic,
            age: age,
            gender: gender,
          });

          // Generate JWT token
          const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );

          // Return user object and token
          res.json({ user: newUser, token: token });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
};
//------------------------------------- Login ------------------------------------
exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user object and token
    res.json({ user: user, token: token });
  })(req, res, next);
};
