const sequelize = require("../../db/db");
const cloudinary = require("../helpers/cloudinary.js");

const { User, Topic, Question, UserFollows, Like } = require("../../../models");

//----------------------------------------Create Question --------------------------------
exports.createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const topicId = req.params.id;

    // Check if the specified topic exists
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // Create a new question
    const newQuestion = await Question.create({
      text: text,
      userId: req.user.id,
      topicId: topic.id,
    });

    res.status(201).json({
      message: "Question created successfully.",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating question." });
  }
};

//-------------------------------------------Update Question --------------------------------

exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { text } = req.body;

    // Check if the question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Check if the logged-in user is the creator of the question
    if (question.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to update this question.",
      });
    }

    await question.update({ text: text });

    res.status(200).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating question." });
  }
};

// ---------------------------------------------- Delete Question ----------------------------------------

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    // Check if the question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (question.userId !== req.user.id) {
      return res.status(403).json({
        message: "You do not have permission to delete this question.",
      });
    }

    await question.destroy();

    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting question." });
  }
};

//------------------------------------------------Like/Dislike a question ------------------------------------------------

exports.LikeDislikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    // Check if the question exists
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    // Check if the user is already liked the question
    const existingLike = await Like.findOne({
      where: { userId: userId, entityId: questionId, entityType: "question" },
    });

    if (existingLike) {
      // If already following, dislike the question
      await existingLike.destroy();
      return res.status(200).json({ message: "You disliked a question." });
    } else {
      // If not following, like the question
      await Like.create({
        userId: userId,
        entityId: questionId,
        entityType: "question",
      });
      return res.status(201).json({ message: "You liked a question." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like question." });
  }
};

//--------------------------------------Questions of topics followings--------------------------------
exports.getQuestionsByFollowedTopics = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the authenticated request

    // Find the user by ID and include the followed topics
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
          attributes: ["id"], // Include only the ID of the followed topics
        },
      ],
    });

    // Extract the IDs of the followed topics
    const followedTopicIds = user.followedTopics.map((topic) => topic.id);

    // Find questions where the topicId is in the list of followed topics
    const questions = await Question.findAll({
      where: {
        topicId: followedTopicIds,
      },
      // Include any necessary associations (e.g., user who posted the question)
      include: [
        {
          model: User,
          attributes: ["id", "name"], // Include only the relevant user information
        },
      ],
      // You can add more options here to sort and paginate questions
      // For example: order: [['createdAt', 'DESC']], limit: 10
    });

    res.status(200).json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
