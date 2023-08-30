//Libraries imports
const jwt = require("jsonwebtoken");
const sequelize = require("../../db/db");
const { DataTypes } = require("sequelize");
const User = require("../models/user")(sequelize, DataTypes);
const passport = require("passport");

//-----------------------------Cloudinary---------------------------------
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
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
          const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          // Return user object and token
          res.status(201).json({ user: newUser, token: token });
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user object and token
    res.status(200).json({ user: user, token: token });
  })(req, res, next);
};

//---------------------------------------Update user--------------------------------
exports.update = async (req, res, next) => {
  const userId = req.user.id;
  console.log(req.profile);

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update allowed fields: name, age, gender, and password
    user.name = req.body.name || user.name;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;

    if (req.body.password) {
      // Update password if provided
      user.password = req.body.password;
    }

    // Save updated user data
    await user.save();

    res.status(201).json({ message: "User information updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user information." });
  }
};
