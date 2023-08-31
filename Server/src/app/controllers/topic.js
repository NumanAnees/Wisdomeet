const sequelize = require("../../db/db");
const { DataTypes } = require("sequelize");
const Topic = require("../models/topic")(sequelize, DataTypes);
const User = require("../models/user")(sequelize, DataTypes);
const UserFollows = require("../models/userFollows")(sequelize, DataTypes);
const cloudinary = require("../helpers/cloudinary.js");

//------------------------------Create a new topic ------------------------------
exports.create = async (req, res) => {
  const userId = req.user.id;
  try {
    const { title, description } = req.body;

    //check if the topic is already existing
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

    // Find the topic by ID
    const topicToUpdate = await Topic.findByPk(topicId);

    // Check if the topic exists
    if (!topicToUpdate) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // Check if the user making the request is the creator of the topic
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

    // Find the topic by ID
    const topicToDelete = await Topic.findByPk(topicId);

    // Check if the topic exists
    if (!topicToDelete) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // Check if the user making the request is the creator of the topic
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

    // Check if the topic exists
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    // Check if the user is already following the topic
    const existingFollow = await UserFollows.findOne({
      where: { userId: userId, topicId: topicId },
    });

    if (existingFollow) {
      // If already following, unfollow the topic
      await existingFollow.destroy();
      return res
        .status(200)
        .json({ message: "You have unfollowed this topic." });
    } else {
      // If not following, follow the topic
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

    // Count the number of users following the topic
    const followersCount = await UserFollows.count({
      where: { topicId: topicId },
    });

    res.status(200).json({ followersCount: followersCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve followers count." });
  }
};

//-------------------------------------------Get All topics-----------------------------------

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.status(200).json({ topics: topics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve topics." });
  }
};

//-------------------------------------Get a single topic--------------------------------
exports.getTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    res.status(200).json({ topic: topic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve topic." });
  }
};
