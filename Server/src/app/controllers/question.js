const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
} = require("../../../models");

//----------------------------------------Create Question --------------------------------
exports.createQuestion = async (req, res) => {
  try {
    const { text } = req.body;
    const topicId = req.params.id;

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

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

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
//-----------------------------------------------Get Single Question --------------------------------
exports.getQuestionWithAnswers = async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId, {
      include: [
        {
          model: Answer,
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch question and answers" });
  }
};

//------------------------------------------------Like/Dislike a question ------------------------------------------------

exports.LikeDislikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    const existingLike = await Like.findOne({
      where: { userId: userId, entityId: questionId, entityType: "question" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: "You disliked a question." });
    } else {
      // If not Liked the question
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
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Topic,
          as: "followedTopics",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followedTopicIds = user.followedTopics.map((topic) => topic.id);

    const questions = await Question.findAll({
      where: { topicId: followedTopicIds },
      include: [
        {
          model: Answer,
          include: [
            {
              model: Like,
            },
          ],
        },
      ],
    });

    questions.forEach((question) => {
      question.Answers.sort((a, b) => {
        const likeCountA = a.Likes.length;
        const likeCountB = b.Likes.length;
        return likeCountB - likeCountA;
      });
    });

    res.status(200).json({ user, questions });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch followed topics and questions" });
  }
};
