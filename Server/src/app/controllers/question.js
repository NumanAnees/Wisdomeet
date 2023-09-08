const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
  Dislike,
} = require("../../../models");

const sequelize = require("sequelize");
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

    // Retrieve the question and its associated answers
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
      return res.status(404).json({ error: "Question not found" });
    }

    const isLikedQuestion = question.likes.some(
      (like) => like.userId === req.user.id
    );

    const isDislikedQuestion = question.dislikes.some(
      (dislike) => dislike.userId === req.user.id
    );

    const formattedQuestion = {
      id: question.id,
      name: question.user ? question.user.name : "",
      picture: question.user ? question.user.profilePic : "",
      text: question.text,
      likes: question.likes.length,
      dislikes: question.dislikes.length,
      isLiked: isLikedQuestion,
      isDisliked: isDislikedQuestion,
    };

    const sortedAnswers = question.answers.map((answer) => {
      const isLikedAnswer = answer.likes.some(
        (like) => like.userId === req.user.id
      );

      const isDislikedAnswer = answer.dislikes.some(
        (dislike) => dislike.userId === req.user.id
      );

      return {
        id: answer.id,
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

    res
      .status(200)
      .json({ question: formattedQuestion, answers: sortedAnswers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch question and answers" });
  }
};

//---------------------------------------------Like a Question ------------------------------------------------
exports.LikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    const existingLike = await Like.findOne({
      where: { userId: userId, questionId: questionId, entityType: "question" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: "Like Removed." });
    } else {
      // If not Liked the question
      await Like.create({
        userId: userId,
        questionId: questionId,
        entityType: "question",
      });
      return res.status(201).json({ message: "Like Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like question." });
  }
};

//------------------------------------------------Dislike a question ------------------------------------------------

exports.DislikeQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }
    const existingLike = await Dislike.findOne({
      where: { userId: userId, questionId: questionId, entityType: "question" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: "Dislike Removed." });
    } else {
      // If not Liked the question
      await Dislike.create({
        userId: userId,
        questionId: questionId,
        entityType: "question",
      });
      return res.status(201).json({ message: "Dislike Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to Dislike question." });
  }
};

//--------------------------------------Questions of topics followings--------------------------------

// exports.getQuestionsByFollowedTopics = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findByPk(userId, {
//       attributes: ["id", "name", "profilePic"],
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const followedTopics = await Topic.findAll({
//       include: [
//         {
//           model: User,
//           as: "followedTopics",
//           where: {
//             id: userId,
//           },
//         },
//       ],
//     });

//     const followedTopicIds = followedTopics.map((topic) => topic.id);

//     const questions = await Question.findAll({
//       where: { topicId: followedTopicIds },
//       include: [
//         {
//           model: Answer,
//           as: "answers",
//           include: [
//             {
//               model: User,
//               as: "user",
//               attributes: ["id", "name", "profilePic"],
//             },
//             {
//               model: Like,
//               as: "likes",
//             },
//             {
//               model: Dislike,
//               as: "dislikes",
//             },
//           ],
//         },
//         {
//           model: User,
//           as: "user",
//           attributes: ["id", "name", "profilePic"],
//         },
//         {
//           model: Like,
//           as: "likes",
//           required: false,
//         },
//         {
//           model: Dislike,
//           as: "dislikes",
//           required: false,
//         },
//       ],
//     });

//     const formattedQuestions = questions.map((question) => {
//       const sortedAnswers = question.answers.sort(
//         (a, b) => b.likes.length - a.likes.length
//       );

//       const isLikedQuestion = question.likes.length > 0;

//       const isDislikedQuestion = question.dislikes.length > 0;

//       const formattedQuestion = {
//         id: question.id,
//         name: question.user ? question.user.name : "",
//         picture: question.user ? question.user.profilePic : "",
//         text: question.text,
//         likes: question.likes.length,
//         dislikes: question.dislikes.length,
//         isLiked: isLikedQuestion,
//         isDisliked: isDislikedQuestion,
//       };

//       const formattedAnswers = sortedAnswers.slice(0, 2).map((answer) => {
//         const isLikedAnswer = answer.likes.some(
//           (like) => like.userId === userId
//         );

//         const isDislikedAnswer = answer.dislikes.some(
//           (dislike) => dislike.userId === userId
//         );

//         return {
//           id: answer.id,
//           name: answer.user ? answer.user.name : "",
//           picture: answer.user ? answer.user.profilePic : "",
//           text: answer.text,
//           likes: answer.likes.length,
//           dislikes: answer.dislikes.length,
//           isLiked: isLikedAnswer,
//           isDisliked: isDislikedAnswer,
//         };
//       });

//       return {
//         question: formattedQuestion,
//         answers: formattedAnswers,
//       };
//     });

//     res.status(200).json(formattedQuestions);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Unable to fetch questions from followed topics" });
//   }
// };

exports.getQuestionsByFollowedTopics = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "profilePic"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
            name: answer.user ? answer.user.name : "",
            picture: answer.user ? answer.user.profilePic : "",
            text: answer.text,
            likes: totalAnswerLikes,
            dislikes: totalAnswerDislikes,
            isLiked: !!answer.likes.find((like) => like.userId === userId),
            isDisliked: !!answer.dislikes.find(
              (dislike) => dislike.userId === userId
            ),
          };
        })
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 2);

      return {
        question: {
          id: question.id,
          name: question.user ? question.user.name : "",
          picture: question.user ? question.user.profilePic : "",
          text: question.text,
          likes: totalQuestionLikes,
          dislikes: totalQuestionDislikes,
          isLiked: !!question.likes.find((like) => like.userId === userId),
          isDisliked: !!question.dislikes.find(
            (dislike) => dislike.userId === userId
          ),
        },
        answers: sortedAnswers,
      };
    });

    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch questions from followed topics" });
  }
};
