const { User, Topic, Question, Like, Answer, Dislike } = require("../../../models");
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_NOT_ALLOWED,
} = require("../helpers/constants");

const sequelize = require("sequelize");
exports.createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const topicIds = req.body["topicIds[]"];
    const createQuestions = [];
    for (let i = 0; i < topicIds.length; i++) {
      const topic = await Topic.findByPk(topicIds[i]);
      if (!topic) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Topic not found." });
      }

      const newQuestion = await Question.create({
        text: text,
        userId: req.user.id,
        topicId: topic.id,
      });
      createQuestions.push(newQuestion);
    }
    res.status(HTTP_STATUS_CREATED).json({
      message: "Question created successfully.",
      question: createQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Error creating question." });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const { text } = req.body;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Question not found." });
    }

    if (question.userId !== req.user.id) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({
        message: "You do not have permission to update this question.",
      });
    }

    await question.update({ text: text });

    res.status(HTTP_STATUS_OK).json({ message: "Question updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Error updating question." });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Question not found." });
    }

    if (question.userId !== req.user.id) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({
        message: "You do not have permission to delete this question.",
      });
    }

    await question.destroy();

    res.status(HTTP_STATUS_OK).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Error deleting question." });
  }
};

exports.getQuestionWithAnswers = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: Answer,
          as: "answers",
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
          attributes: ["id", "text"],
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
      attributes: ["id", "text"],
    });

    if (!question) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Question not found" });
    }

    const isLikedQuestion = question.likes.some((like) => like.userId == req.user.id);

    const isDislikedQuestion = question.dislikes.some((dislike) => dislike.userId == req.user.id);

    const formattedQuestion = {
      id: question.id,
      userId: question.user ? question.user.id : "",
      name: question.user ? question.user.name : "",
      picture: question.user ? question.user.profilePic : "",
      text: question.text,
      likes: question.likes.length,
      dislikes: question.dislikes.length,
      isLiked: isLikedQuestion,
      isDisliked: isDislikedQuestion,
    };

    const sortedAnswers = question.answers.map((answer) => {
      const isLikedAnswer = answer.likes.some((like) => like.userId == req.user.id);

      const isDislikedAnswer = answer.dislikes.some((dislike) => dislike.userId == req.user.id);

      return {
        id: answer.id,
        userId: answer.user ? answer.user.id : "",
        name: answer.user ? answer.user.name : "",
        picture: answer.user ? answer.user.profilePic : "",
        text: answer.text,
        likes: answer.likes.length,
        dislikes: answer.dislikes.length,
        isLiked: isLikedAnswer,
        isDisliked: isDislikedAnswer,
      };
    });

    sortedAnswers.sort((a, b) => b.likes - a.likes);

    res.status(HTTP_STATUS_OK).json({ question: formattedQuestion, answers: sortedAnswers });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to fetch question and answers" });
  }
};

exports.LikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Question not found." });
    }
    const existingLike = await Like.findOne({
      where: { userId: userId, questionId: questionId, entityType: "question" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(HTTP_STATUS_OK).json({ message: "Like Removed." });
    } else {
      await Like.create({
        userId: userId,
        questionId: questionId,
        entityType: "question",
      });
      return res.status(HTTP_STATUS_CREATED).json({ message: "Like Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to like question." });
  }
};

exports.DislikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Question not found." });
    }
    const existingLike = await Dislike.findOne({
      where: { userId: userId, questionId: questionId, entityType: "question" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(HTTP_STATUS_OK).json({ message: "Dislike Removed." });
    } else {
      await Dislike.create({
        userId: userId,
        questionId: questionId,
        entityType: "question",
      });
      return res.status(HTTP_STATUS_CREATED).json({ message: "Dislike Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to Dislike question." });
  }
};

exports.getQuestionsByFollowedTopics = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "profilePic"],
    });

    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "User not found" });
    }

    const followedTopics = await Topic.findAll({
      include: [
        {
          model: User,
          as: "followedTopics",
          where: {
            id: userId,
          },
        },
      ],
    });

    const followedTopicIds = followedTopics.map((topic) => topic.id);

    const questions = await Question.findAll({
      where: { topicId: followedTopicIds },
      include: [
        {
          model: Answer,
          as: "answers",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "profilePic"],
            },
            {
              model: Like,
              as: "likes",
            },
            {
              model: Dislike,
              as: "dislikes",
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
          required: false,
        },
        {
          model: Dislike,
          as: "dislikes",
          required: false,
        },
      ],
    });

    const formattedQuestions = questions.map((question) => {
      const totalQuestionLikes = question.likes.length;
      const totalQuestionDislikes = question.dislikes.length;

      const sortedAnswers = question.answers
        .map((answer) => {
          const totalAnswerLikes = answer.likes.length;
          const totalAnswerDislikes = answer.dislikes.length;

          return {
            id: answer.id,
            userId: answer.user ? answer.user.id : "",
            name: answer.user ? answer.user.name : "",
            picture: answer.user ? answer.user.profilePic : "",
            text: answer.text,
            likes: totalAnswerLikes,
            dislikes: totalAnswerDislikes,
            isLiked: !!answer.likes.find((like) => like.userId == userId),
            isDisliked: !!answer.dislikes.find((dislike) => dislike.userId == userId),
          };
        })
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 2);

      return {
        question: {
          id: question.id,
          userId: question.user ? question.user.id : "",
          name: question.user ? question.user.name : "",
          picture: question.user ? question.user.profilePic : "",
          text: question.text,
          likes: totalQuestionLikes,
          dislikes: totalQuestionDislikes,
          isLiked: !!question.likes.find((like) => like.userId == userId),
          isDisliked: !!question.dislikes.find((dislike) => dislike.userId == userId),
        },
        answers: sortedAnswers,
      };
    });

    res.status(HTTP_STATUS_OK).json(formattedQuestions);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to fetch questions from followed topics" });
  }
};
