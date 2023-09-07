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
// exports.getQuestionWithAnswers = async (req, res) => {
//   try {
//     const questionId = req.params.id;

//     const question = await Question.findByPk(questionId, {
//       include: [
//         {
//           as:"answers",
//           model: Answer,
//         },
//       ],
//     });

//     if (!question) {
//       return res.status(404).json({ error: "Question not found" });
//     }

//     res.status(200).json({ question });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Unable to fetch question and answers" });
//   }
// };
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
              model: User, // Include the user who posted the answer
              as: "user",
              attributes: ["id", "name", "profilePic"], // Include user information
            },
            {
              model: Like,
              as: "likes",
              attributes: ["id", "userId"], // Include only necessary attributes
            },
          ],
          attributes: ["id", "text"], // Include only necessary attributes
        },
        {
          model: User, // Include the user who posted the question
          as: "user",
          attributes: ["id", "name", "profilePic"], // Include user information
        },
        {
          model: Like,
          as: "likes",
          attributes: ["id", "userId"], // Include only necessary attributes
        },
        {
          model: Dislike,
          as: "dislikes",
          attributes: ["id", "userId"], // Include only necessary attributes
        },
      ],
      attributes: ["id", "text"], // Include only necessary attributes
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Format the question data
    const formattedQuestion = {
      id: question.id,
      name: question.user ? question.user.name : "", // User who posted the question
      picture: question.user ? question.user.profilePic : "", // User who posted the question
      text: question.text,
      likes: question.likes.length,
      dislikes: question.dislikes.length,
    };

    // Sort answers by likes in descending order
    const sortedAnswers = question.answers.map((answer) => ({
      id: answer.id,
      name: answer.user ? answer.user.name : "", // User who posted the answer
      picture: answer.user ? answer.user.profilePic : "", // User who posted the answer
      text: answer.text,
      likes: answer.likes.length,
      dislikes: 0, // Initialize dislikes count to 0
    }));

    sortedAnswers.sort((a, b) => b.likes - a.likes);

    // Return the formatted data
    res
      .status(200)
      .json({ question: formattedQuestion, answers: sortedAnswers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch question and answers" });
  }
};

//------------------------------------------------Like a question ------------------------------------------------

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

//     // Retrieve user information, including their profile picture and name
//     const user = await User.findByPk(userId, {
//       attributes: ["id", "name", "profilePic"],
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the topics followed by the user
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

//     // Extract topic IDs from the followed topics
//     const followedTopicIds = followedTopics.map((topic) => topic.id);

//     // Retrieve questions for the followed topics
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
//         },
//         {
//           model: Dislike,
//           as: "dislikes",
//         },
//       ],
//     });

//     // Process the data manually
//     const formattedQuestions = questions.map((question) => {
//       // Sort answers by likes in descending order
//       const sortedAnswers = question.answers.sort(
//         (a, b) => b.likes.length - a.likes.length
//       );

//       // Format the question data
//       const formattedQuestion = {
//         id: question.id,
//         name: user.name,
//         picture: user.profilePic,
//         text: question.text,
//         likes: question.likes.length,
//         dislikes: question.dislikes.length,
//       };

//       // Format the answers data
//       const formattedAnswers = sortedAnswers.slice(0, 2).map((answer) => {
//         return {
//           id: answer.id,
//           name: answer.user.name,
//           picture: answer.user.profilePic,
//           text: answer.text,
//           likes: answer.likes.length,
//           dislikes: answer.dislikes.length,
//         };
//       });

//       // Combine question and answers data
//       return {
//         question: formattedQuestion,
//         answers: formattedAnswers,
//       };
//     });

//     // Return the formatted data
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

    // Retrieve user information, including their profile picture and name
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "profilePic"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the topics followed by the user
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

    // Extract topic IDs from the followed topics
    const followedTopicIds = followedTopics.map((topic) => topic.id);

    // Retrieve questions for the followed topics
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
        },
        {
          model: Dislike,
          as: "dislikes",
        },
      ],
    });

    // Process the data manually
    const formattedQuestions = questions.map((question) => {
      // Sort answers by likes in descending order
      const sortedAnswers = question.answers.sort(
        (a, b) => b.likes.length - a.likes.length
      );

      // Format the question data
      const formattedQuestion = {
        id: question.id,
        name: question.user ? question.user.name : "", // Check if user is defined
        picture: question.user ? question.user.profilePic : "", // Check if user is defined
        text: question.text,
        likes: question.likes.length,
        dislikes: question.dislikes.length,
      };

      // Format the answers data
      const formattedAnswers = sortedAnswers.slice(0, 2).map((answer) => {
        return {
          id: answer.id,
          name: answer.user ? answer.user.name : "", // Check if user is defined
          picture: answer.user ? answer.user.profilePic : "", // Check if user is defined
          text: answer.text,
          likes: answer.likes.length,
          dislikes: answer.dislikes.length,
        };
      });

      // Combine question and answers data
      return {
        question: formattedQuestion,
        answers: formattedAnswers,
      };
    });

    // Return the formatted data
    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Unable to fetch questions from followed topics" });
  }
};
