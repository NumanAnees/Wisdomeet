const cloudinary = require("../helpers/cloudinary.js");

const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
  Dislike,
} = require("../../../models");

//------------------------------Create a new topic ------------------------------
exports.create = async (req, res) => {
  const userId = req.user.id;
  try {
    const { title, description } = req.body;

    const existingTopic = await Topic.findOne({
      where: { title: title },
    });
    if (existingTopic) {
      return res.status(409).json({ message: "Topic already exists." });
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
          const topicPicture = result.url;
          // Create a new topic
          const newTopic = await Topic.create({
            title: title,
            description: description,
            createdBy: userId,
            topicPicture: topicPicture,
          });

          // Return topic object and token
          res.status(201).json({ message: "Success", topic: newTopic });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Topic creation failed." });
  }
};

//---------------------------------------------Update topic --------------------------------
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const topicId = req.params.id;

    const topicToUpdate = await Topic.findByPk(topicId);

    if (!topicToUpdate) {
      return res.status(404).json({ message: "Topic not found." });
    }

    if (topicToUpdate.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this topic." });
    }

    // Update the topic
    await topicToUpdate.update({
      title: title,
      description: description,
    });

    res
      .status(200)
      .json({ message: "Topic updated successfully.", topic: topicToUpdate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Topic update failed." });
  }
};

//---------------------------------------Delete Topic --------------------------------
exports.deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const topicToDelete = await Topic.findByPk(topicId);

    if (!topicToDelete) {
      return res.status(404).json({ message: "Topic not found." });
    }

    if (topicToDelete.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this topic." });
    }

    // Delete the topic
    await topicToDelete.destroy();

    res.status(200).json({ message: "Topic deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Topic deletion failed." });
  }
};

//---------------------------------Follow a topic------------------------------

exports.followOrUnfollowTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = req.params.id;

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const existingFollow = await UserFollows.findOne({
      where: { userId: userId, topicId: topicId },
    });

    if (existingFollow) {
      await existingFollow.destroy();
      return res
        .status(200)
        .json({ message: "You have unfollowed this topic." });
    } else {
      await UserFollows.create({
        userId: userId,
        topicId: topicId,
      });
      return res
        .status(201)
        .json({ message: "You are now following this topic." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update follow status." });
  }
};
//---------------------------------Follower count of a topic -------------------------------

exports.getFollowCount = async (req, res) => {
  try {
    const topicId = req.params.id;

    const followersCount = await UserFollows.count({
      where: { topicId: topicId },
    });

    res.status(200).json({ followersCount: followersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve followers count." });
  }
};

//-------------------------------------------Get All topics user not following-----------------------------------

exports.getAllTopics = async (req, res) => {
  try {
    const userId = req.user.id;
    const allTopics = await Topic.findAll();
    const followedTopics = await UserFollows.findAll({
      where: {
        userId: userId,
      },
    });

    // Extract the IDs of followed topics in an array[]
    const followedTopicIds = followedTopics.map(
      (followedTopic) => followedTopic.topicId
    );

    const topicsNotFollowedByUser = allTopics.filter((topic) => {
      return !followedTopicIds.includes(topic.id); //if included in array ignore otherwise add
    });

    res.json(topicsNotFollowedByUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//-------------------------------------Get a single topic--------------------------------

// exports.getTopic = async (req, res) => {
//   try {
//     const topicId = req.params.id;

//     const topic = await Topic.findByPk(topicId);

//     if (!topic) {
//       return res.status(404).json({ message: "Topic not found." });
//     }

//     // Check if the user followed the topic
//     const isUserFollowed = await UserFollows.findOne({
//       where: { userId: req.user.id, topicId: topicId },
//     });

//     const isFollowed = !!isUserFollowed;

//     const questions = await Question.findAll({
//       where: { topicId: topicId },
//       include: [
//         {
//           model: Like,
//           as: "likes",
//           attributes: ["id", "questionId", "userId"],
//         },
//         {
//           model: Answer,
//           as: "answers", // Include answers
//           include: [
//             {
//               model: Like,
//               as: "likes",
//               attributes: ["id", "answerId", "userId"],
//             },
//           ],
//           attributes: ["id", "text"],
//         },
//       ],
//       attributes: ["id", "text"],
//     });

//     const formattedQuestions = questions.map((question) => {
//       const sortedAnswers = question.answers.map((answer) => {
//         return {
//           id: answer.id,
//           name: "", // You can populate user data here
//           picture: "", // You can populate user data here
//           text: answer.text,
//           likes: answer.likes.length,
//           dislikes: 0, // Initialize dislikes count to 0
//         };
//       });

//       sortedAnswers.sort((a, b) => b.likes - a.likes); // Sort answers by likes

//       return {
//         question: {
//           id: question.id,
//           name: "John Doe", // You can populate user data here
//           picture: "profile-pic.jpg", // You can populate user data here
//           text: question.text,
//           likes: question.likes.length,
//           dislikes: 0, // Initialize dislikes count to 0
//         },
//         answers: sortedAnswers.slice(0, 2), // Get the top 2 answers
//       };
//     });

//     res
//       .status(200)
//       .json({ Topic: topic, Questions: formattedQuestions, isFollowed });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong." });
//   }
// };

exports.getTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const topic = await Topic.findByPk(topicId);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // Check if the user followed the topic
    const isUserFollowed = await UserFollows.findOne({
      where: { userId: req.user.id, topicId: topicId },
    });

    const isFollowed = !!isUserFollowed;

    const questions = await Question.findAll({
      where: { topicId: topicId },
      include: [
        {
          model: Like,
          as: "likes",
          attributes: ["id", "questionId", "userId"],
        },
        {
          model: User, // Include the user who posted the question
          as: "user",
          attributes: ["id", "name", "profilePic"], // Include user information
        },
        {
          model: Answer,
          as: "answers", // Include answers
          include: [
            {
              model: Like,
              as: "likes",
              attributes: ["id", "answerId", "userId"],
            },
            {
              model: User, // Include the user who posted the answer
              as: "user",
              attributes: ["id", "name", "profilePic"], // Include user information
            },
          ],
          attributes: ["id", "text"],
        },
      ],
      attributes: ["id", "text"],
    });

    const formattedQuestions = questions.map((question) => {
      const sortedAnswers = question.answers.map((answer) => {
        return {
          id: answer.id,
          name: answer.user ? answer.user.name : "", // User who posted the answer
          picture: answer.user ? answer.user.profilePic : "", // User who posted the answer
          text: answer.text,
          likes: answer.likes.length,
          dislikes: 0, // Initialize dislikes count to 0
        };
      });

      sortedAnswers.sort((a, b) => b.likes - a.likes); // Sort answers by likes

      return {
        question: {
          id: question.id,
          name: question.user ? question.user.name : "", // User who posted the question
          picture: question.user ? question.user.profilePic : "", // User who posted the question
          text: question.text,
          likes: question.likes.length,
          dislikes: 0, // Initialize dislikes count to 0
        },
        answers: sortedAnswers.slice(0, 2), // Get the top 2 answers
      };
    });

    res
      .status(200)
      .json({ Topic: topic, Questions: formattedQuestions, isFollowed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

//------------------------------------_All topics logged in user following--------------------------------
exports.getFollowedTopics = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["name", "email"],
      include: [
        {
          model: Topic,
          as: "followedTopics",
          attributes: ["id", "title", "topicPicture"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedTopics = user.followedTopics;
    return res.status(200).json(followedTopics);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error, Cannot find topics" });
  }
};
