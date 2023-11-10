const cloudinary = require("../helpers/cloudinary.js");

const { User, Topic, Question, UserFollows, Like, Answer, Dislike } = require("../../../models/index.js");

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_NOT_ALLOWED,
} = require("../helpers/constants.js");

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
    cloudinary.uploader.upload(imagePath.tempFilePath, async (error, result) => {
      if (error) {
        console.error(error);
      } else {
        const topicPicture = result.url;
        const newTopic = await Topic.create({
          title: title,
          description: description,
          createdBy: userId,
          topicPicture: topicPicture,
        });

        res.status(HTTP_STATUS_CREATED).json({ message: "Success", topic: newTopic });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Topic creation failed." });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const topicId = req.params.id;

    const topicToUpdate = await Topic.findByPk(topicId);

    if (!topicToUpdate) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Topic not found." });
    }

    if (topicToUpdate.createdBy !== req.user.id) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({ message: "You are not authorized to update this topic." });
    }

    const imagePath = req?.files?.picture;
    if (imagePath) {
      cloudinary.uploader.upload(imagePath.tempFilePath, async (error, result) => {
        if (error) {
          console.error(error);
        } else {
          const topicPicture = result.url;
          topicToUpdate.topicPicture = topicPicture;
          topicToUpdate.title = title;
          topicToUpdate.description = description;

          await topicToUpdate.save();
          res.status(201).json({ message: "Success", topic: topicToUpdate });
        }
      });
    } else {
      topicToUpdate.title = title;
      topicToUpdate.description = description;

      await topicToUpdate.save();
      res.status(HTTP_STATUS_CREATED).json({ message: "Success", topic: topicToUpdate });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Topic update failed." });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const topicToDelete = await Topic.findByPk(topicId);

    if (!topicToDelete) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Topic not found." });
    }

    if (topicToDelete.createdBy !== req.user.id) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({ message: "You are not authorized to delete this topic." });
    }

    await topicToDelete.destroy();

    res.status(HTTP_STATUS_OK).json({ message: "Topic deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Topic deletion failed." });
  }
};

exports.followOrUnfollowTopic = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicId = req.params.id;

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Topic not found." });
    }

    const existingFollow = await UserFollows.findOne({
      where: { userId: userId, topicId: topicId },
    });

    if (existingFollow) {
      await existingFollow.destroy();
      return res.status(HTTP_STATUS_OK).json({ message: "You have unfollowed this topic." });
    } else {
      await UserFollows.create({
        userId: userId,
        topicId: topicId,
      });
      return res.status(HTTP_STATUS_CREATED).json({ message: "You are now following this topic." });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to update follow status." });
  }
};

exports.getFollowCount = async (req, res) => {
  try {
    const topicId = req.params.id;

    const followersCount = await UserFollows.count({
      where: { topicId: topicId },
    });

    res.status(HTTP_STATUS_OK).json({ followersCount: followersCount });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to retrieve followers count." });
  }
};

exports.getAllTopics = async (req, res) => {
  try {
    const userId = req.user.id;
    const allTopics = await Topic.findAll();
    const followedTopics = await UserFollows.findAll({
      where: {
        userId: userId,
      },
    });

    const followedTopicIds = followedTopics.map(followedTopic => followedTopic.topicId);

    const topicsNotFollowedByUser = allTopics.filter(topic => {
      return !followedTopicIds.includes(topic.id);
    });

    res.json(topicsNotFollowedByUser);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

exports.getTopic = async (req, res) => {
  try {
    const topicId = req.params.id;

    const topic = await Topic.findByPk(topicId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profilePic"],
        },
      ],
    });

    if (!topic) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Topic not found." });
    }

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
          model: Dislike,
          as: "dislikes",
          attributes: ["id", "questionId", "userId"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "profilePic"],
        },
        {
          model: Answer,
          as: "answers",
          include: [
            {
              model: Like,
              as: "likes",
              attributes: ["id", "answerId", "userId"],
            },
            {
              model: Dislike,
              as: "dislikes",
              attributes: ["id", "answerId", "userId"],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "profilePic"],
            },
          ],
          attributes: ["id", "text"],
        },
      ],
      attributes: ["id", "text"],
    });
    questions.sort((a, b) => b.likes.length - a.likes.length);

    const formattedQuestions = questions.map(question => {
      const sortedAnswers = question.answers
        .map(answer => {
          const isLikedAnswer = answer.likes.some(like => like.userId == req.user.id);

          const isDislikedAnswer = answer.dislikes.some(dislike => dislike.userId == req.user.id);

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
        })
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 2);

      const isLikedQuestion = question.likes.some(like => like.userId == req.user.id);

      const isDislikedQuestion = question.dislikes.some(dislike => dislike.userId == req.user.id);

      return {
        question: {
          id: question.id,
          userId: question.user ? question.user.id : "",
          name: question.user ? question.user.name : "",
          picture: question.user ? question.user.profilePic : "",
          text: question.text,
          likes: question.likes.length,
          dislikes: question.dislikes.length,
          isLiked: isLikedQuestion,
          isDisliked: isDislikedQuestion,
        },
        answers: sortedAnswers,
      };
    });
    res.status(HTTP_STATUS_OK).json({
      Topic: topic,
      Questions: formattedQuestions,
      isFollowed,
      isOwner: topic && topic?.user.id == req.user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Something went wrong." });
  }
};

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
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "User not found" });
    }

    const followedTopics = user.followedTopics;
    return res.status(HTTP_STATUS_OK).json(followedTopics);
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Internal server error, Cannot find topics" });
  }
};

exports.getEveryTopic = async (req, res) => {
  try {
    const allTopics = await Topic.findAll({
      attributes: ["id", "title"],
    });
    res.status(HTTP_STATUS_OK).json(allTopics);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Something went wrong." });
  }
};
