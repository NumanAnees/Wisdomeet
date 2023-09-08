//Libraries imports
const jwt = require("jsonwebtoken");
const passport = require("passport");
const cloudinary = require("../helpers/cloudinary.js");
const { Op } = require("sequelize");

const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
  Dislike,
} = require("../../../models");

//-----------------------------Register--------------------------------
exports.register = async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;

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
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = req.body.name;
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.password = req.body.password;

    await user.save();

    res
      .status(201)
      .json({ message: "User information updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user information." });
  }
};

//------------------------------------Delete user information --------------------------------
exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

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
    const userId = req.user.id;

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
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
        {
          model: Question,
          as: "questions",
          attributes: ["id", "text"],
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id", "text"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch user info" });
  }
};

//-------------------------------------------------User Profile --------------------------------
exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const answeredQuestions = await Question.findAll({
      include: [
        {
          model: Answer,
          as: "answers",
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

//------------------------------------------Search Topic --------------------------------

exports.search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const questions = await Question.findAll({
      where: {
        text: {
          [Op.like]: `%${keyword}%`,
        },
      },
      attributes: ["id", "text"],
      include: [
        {
          model: Like,
          as: "likes",
          attributes: [],
        },
        {
          model: Dislike,
          as: "dislikes",
          attributes: [],
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id", "text"],
          include: [
            {
              model: Like,
              as: "likes",
              attributes: [],
            },
            {
              model: Dislike,
              as: "dislikes",
              attributes: [],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "profilePic"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profilePic"],
        },
      ],
    });

    // Process the questions and answers to include IDs, likes, dislikes, and top 2 answers
    const formattedQuestions = questions.map((question) => {
      const formattedQuestion = {
        id: question.id,
        name: question.user ? question.user.name : "Unknown User",
        picture: question.user
          ? question.user.profilePic
          : "https://example.com/default-avatar.jpg",
        text: question.text,
        likes: question.likes ? question.likes.length : 0,
        dislikes: question.dislikes ? question.dislikes.length : 0,
      };

      // Sort answers by likes and get the top 2 answers
      if (question.answers && question.answers.length > 0) {
        const sortedAnswers = question.answers.sort(
          (a, b) =>
            (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0)
        );
        const topAnswers = sortedAnswers.slice(0, 2).map((answer) => ({
          id: answer.id,
          name: answer.user ? answer.user.name : "Unknown User",
          picture: answer.user
            ? answer.user.profilePic
            : "https://example.com/default-avatar.jpg",
          text: answer.text,
          likes: answer.likes ? answer.likes.length : 0,
          dislikes: answer.dislikes ? answer.dislikes.length : 0,
        }));

        formattedQuestion.answers = topAnswers;
      } else {
        formattedQuestion.answers = [];
      }

      return formattedQuestion;
    });

    res.status(200).json({ questions: formattedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
