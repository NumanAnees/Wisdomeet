const jwt = require("jsonwebtoken");
const passport = require("passport");
const cloudinary = require("../helpers/cloudinary.js");
const { Op } = require("sequelize");
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED, HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } = require("../helpers/constants.js");

const { User, Topic, Question, Like, Answer, Dislike } = require("../../../models/index.js");
const { QuestionHelper } = require("../helpers/ControllerHelper.js");
const { emailHelper } = require("../helpers/emailHelper.js");

exports.register = async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const imagePath = req.files.picture;
    cloudinary.uploader.upload(imagePath.tempFilePath, async (error, result) => {
      if (error) {
        console.error(error);
      } else {
        const profilePic = result.url;
        const newUser = await User.create({
          email: email,
          password: password,
          name: name,
          profilePic: profilePic,
          age: age,
          gender: gender,
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        await emailHelper(newUser);
        res.status(HTTP_STATUS_CREATED).json({ user: newUser, token: token });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Registration failed." });
  }
};

exports.login = async (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(204).json({ message: "Incorrect email or password." });
    }
    if (!user.isVerified) {
      return res.status(203).json({ message: "Please confirm your email to login" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(HTTP_STATUS_OK).json({ user: user, token: token });
  })(req, res, next);
};

exports.update = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "User not found." });
    }

    user.name = req.body.name;
    user.age = req.body.age;
    user.gender = req.body.gender;
    user.password = req.body.password;

    await user.save();

    res.status(HTTP_STATUS_CREATED).json({ message: "User information updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to update user information." });
  }
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "User not found." });
    }

    await user.destroy();

    res.status(HTTP_STATUS_OK).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to delete user." });
  }
};

exports.getUserQuestions = async (req, res) => {
  try {
    const userId = req.user.id;

    const userQuestions = await Question.findAll({
      where: {
        userId: userId,
      },
    });

    res.status(HTTP_STATUS_OK).json({ questions: userQuestions });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Error retrieving user's questions." });
  }
};

exports.about = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
          attributes: ["id", "title", "topicPicture"],
          through: {
            attributes: [],
          },
        },
        {
          model: Question,
          as: "questions",
          attributes: ["id", "text"],
          include: [
            {
              model: Like,
              as: "likes",
            },
            {
              model: Dislike,
              as: "dislikes",
            },
            {
              model: User,
              as: "user",
              attributes: ["id"],
            },
          ],
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id", "text", "questionId"],
          include: [
            {
              model: Like,
              as: "likes",
            },
            {
              model: Dislike,
              as: "dislikes",
            },
            {
              model: User,
              as: "user",
              attributes: ["id"],
            },
            {
              model: Question,
              as: "question",
              attributes: ["id", "text"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "User not found" });
    }

    const followedTopics = user.followedTopics.map(topic => ({
      id: topic.id,
      title: topic.title,
      topicPicture: topic.topicPicture,
    }));

    const userQuestions = user.questions.map(question => ({
      question: {
        id: question.id,
        userId: question.user ? question.user.id : "",
        name: user.name,
        picture: user.profilePic,
        text: question.text,
        likes: question.likes.length,
        dislikes: question.dislikes.length,
        isLiked: !!question.likes.find(like => like.userId == req.user.id),
        isDisliked: !!question.dislikes.find(dislike => dislike.userId == req.user.id),
      },
      answers: [],
    }));

    const userAnswers = await Promise.all(
      user.answers.map(async answer => {
        const questionId = answer.questionId;

        const question = await QuestionHelper(questionId, req.user.id);
        return {
          question: question,
          answers: [
            {
              id: answer.id,
              userId: answer.user ? answer.user.id : "",
              name: user.name,
              picture: user.profilePic,
              text: answer.text,
              likes: answer.likes.length,
              dislikes: answer.dislikes.length,
              isLiked: !!answer.likes.find(like => like.userId == req.user.id),
              isDisliked: !!answer.dislikes.find(dislike => dislike.userId == req.user.id),
            },
          ],
        };
      })
    );
    res.status(HTTP_STATUS_OK).json({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      age: user.age,
      gender: user.gender,
      profilePic: user.profilePic,
      role: user.role,
      followedTopics,
      questions_posted: userQuestions,
      answer_posted: userAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to fetch user info" });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
          attributes: ["id", "title", "topicPicture"],
          through: {
            attributes: [],
          },
        },
        {
          model: Question,
          as: "questions",
          attributes: ["id", "text"],
          include: [
            {
              model: Like,
              as: "likes",
            },
            {
              model: Dislike,
              as: "dislikes",
            },
            {
              model: User,
              as: "user",
              attributes: ["id"],
            },
          ],
        },
        {
          model: Answer,
          as: "answers",
          attributes: ["id", "text", "questionId"],
          include: [
            {
              model: Like,
              as: "likes",
            },
            {
              model: Dislike,
              as: "dislikes",
            },
            {
              model: Question,
              as: "question",
              attributes: ["id", "text"],
            },
            {
              model: User,
              as: "user",
              attributes: ["id"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "User not found" });
    }

    const followedTopics = user.followedTopics.map(topic => ({
      id: topic.id,
      title: topic.title,
      topicPicture: topic.topicPicture,
    }));

    const userQuestions = user.questions.map(question => ({
      question: {
        id: question.id,
        userId: question.user ? question.user.id : "",
        name: user.name,
        picture: user.profilePic,
        text: question.text,
        likes: question.likes.length,
        dislikes: question.dislikes.length,
        isLiked: !!question.likes.find(like => like.userId == req.params.id),
        isDisliked: !!question.dislikes.find(dislike => dislike.userId == req.params.id),
      },
      answers: [],
    }));

    const userAnswers = await Promise.all(
      user.answers.map(async answer => {
        const questionId = answer.questionId;
        const question = await QuestionHelper(questionId, userId);
        return {
          question: question,
          answers: [
            {
              id: answer.id,
              name: user.name,
              userId: answer.user ? answer.user.id : "",
              picture: user.profilePic,
              text: answer.text,
              likes: answer.likes.length,
              dislikes: answer.dislikes.length,
              isLiked: !!answer.likes.find(like => like.userId == req.params.id),
              isDisliked: !!answer.dislikes.find(dislike => dislike.userId == req.params.id),
            },
          ],
        };
      })
    );
    res.status(HTTP_STATUS_OK).json({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      age: user.age,
      gender: user.gender,
      profilePic: user.profilePic,
      role: user.role,
      followedTopics,
      questions_posted: userQuestions,
      answer_posted: userAnswers,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to fetch user info" });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    const questions = await Question.findAll({
      where: {
        [Op.and]: [
          {
            text: {
              [Op.iLike]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["id", "text"],
      include: [
        {
          model: Answer,
          as: "answers",
          attributes: ["id", "text"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "profilePic"],
            },
            {
              model: Like,
              as: "likes",
              attributes: ["id", "userId"],
            },
            {
              model: Dislike,
              as: "dislikes",
              attributes: ["id", "userId"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profilePic"],
        },
        {
          model: Like,
          as: "likes",
          attributes: ["id", "userId"],
        },
        {
          model: Dislike,
          as: "dislikes",
          attributes: ["id", "userId"],
        },
      ],
    });

    const formattedQuestions = questions.map(question => {
      const formattedAnswers = [];

      if (question.answers && question.answers.length > 0) {
        const sortedAnswers = question.answers.sort((a, b) => (b.likes ? b.likes.length : 0) - (a.likes ? a.likes.length : 0));

        sortedAnswers.slice(0, 2).forEach(answer => {
          formattedAnswers.push({
            id: answer.id,
            name: answer.user ? answer.user.name : "Unknown User",
            picture: answer.user ? answer.user.profilePic : "https://example.com/default-avatar.jpg",
            text: answer.text,
            likes: answer.likes.length,
            dislikes: answer.dislikes.length,
            isLiked: answer.likes.some(like => like.userId == req.user.id),
            isDisliked: answer.dislikes.some(dislike => dislike.userId == req.user.id),
          });
        });
      }

      return {
        question: {
          id: question.id,
          name: question.user ? question.user.name : "Unknown User",
          picture: question.user ? question.user.profilePic : "https://example.com/default-avatar.jpg",
          text: question.text,
          likes: question.likes.length,
          dislikes: question.dislikes.length,
          isLiked: question.likes.some(like => like.userId == req.user.id),
          isDisliked: question.dislikes.some(dislike => dislike.userId == req.user.id),
        },
        answers: formattedAnswers,
      };
    });

    res.status(HTTP_STATUS_OK).json(formattedQuestions);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Something went wrong." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(HTTP_STATUS_OK).json(users);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Something went wrong." });
  }
};

exports.confirmation = async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    const user = await User.findByPk(id);
    user.isVerified = true;
    await user.save();
    return res.redirect("http://localhost:3000");
  } catch (e) {
    console.error(e);
    res.status(HTTP_STATUS_SERVER_ERROR).send("Error verifying user");
  }
};
