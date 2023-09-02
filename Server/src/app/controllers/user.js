//Libraries imports
const jwt = require("jsonwebtoken");
const sequelize = require("../../db/db");
const passport = require("passport");
const cloudinary = require("../helpers/cloudinary.js");

const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
} = require("../../../models");

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

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update allowed fields: name, age, gender, and password
    user.name = req.body.name;
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.password = req.body.password;

    // Save updated user data
    await user.save();

    res.status(201).json({ message: "User information updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user information." });
  }
};

//------------------------------------Delete user information --------------------------------
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete user
    await user.destroy();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

//------------------------------------------User Questions-------------------------------------------
exports.getUserQuestions = async (req, res) => {
  try {
    const userId = req.user.id; // Get the current logged-in user's ID

    // Retrieve all questions posted by the user
    const userQuestions = await Question.findAll({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({ questions: userQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user's questions." });
  }
};
//--------------------------------------------About me---------------------------------------------
exports.about = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you pass the user ID as a route parameter

    // Find the user by ID with their followed topics
    // Find the user by ID with their followed topics, asked questions, and answers
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
          through: "UserFollows", // Make sure to use the correct through model name
        },
        {
          model: Question,
          attributes: ["id", "text"], // Include only necessary attributes
          include: [
            {
              model: Like,
              where: { entityType: "question" },
            },
          ],
        },
        {
          model: Answer,
          attributes: ["id", "text"], // Include only necessary attributes
          include: [
            {
              model: Like,
              where: { entityType: "answer" },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user); // Respond with user info, followed topics, asked questions, and answers
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch user info" });
  }
};

//-------------------------------------------------User Profile --------------------------------
exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user information
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch questions answered by the user
    const answeredQuestions = await Question.findAll({
      include: [
        {
          model: Answer,
          where: { userId },
        },
      ],
    });

    res.status(200).json({ user, answeredQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch user profile" });
  }
};
