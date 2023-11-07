const sequelize = require("../../db/db");
const cloudinary = require("../helpers/cloudinary.js");
const { Op } = require("sequelize");

const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
} = require("../../../models");

// -------------------------------------------Create answer-------------------------------------------------
exports.createAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    const questionId = req.params.id;
    const userId = req.user.id; // Assuming the user ID is available in req.user.id

    // Create the answer
    const newAnswer = await Answer.create({
      text,
      userId,
      questionId,
    });

    res.status(201).json(newAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to create the answer" });
  }
};

//---------------------------------------------Update Answer --------------------------------
exports.updateAnswer = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you pass the answer ID as a route parameter
    const { text } = req.body;
    const userId = req.user.id; // Assuming the user ID is available in req.user.id

    // Check if the answer with the given ID exists
    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if the user trying to update the answer is the creator
    if (existingAnswer.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this answer" });
    }

    // Update the answer
    await existingAnswer.update({
      text,
    });

    res.status(200).json(existingAnswer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update the answer" });
  }
};

//-------------------------------------Delete Answer --------------------------------
exports.deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params; // Assuming you pass the answer ID as a route parameter
    const userId = req.user.id; // Assuming the user ID is available in req.user.id

    // Check if the answer with the given ID exists
    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if the user trying to delete the answer is the creator
    if (existingAnswer.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this answer" });
    }

    // Delete the answer
    await existingAnswer.destroy();

    res.status(200).json({ message: "Answer deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to delete the answer" });
  }
};

//------------------------------------------------Like/Dislike an answer ------------------------------------------------

exports.LikeDislikeAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const answerId = req.params.id;

    // Check if the answer exists
    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }
    // Check if the user is already liked the answer
    const existingLike = await Like.findOne({
      where: { userId: userId, entityId: answerId, entityType: "answer" },
    });

    if (existingLike) {
      // If already following, dislike the answer
      await existingLike.destroy();
      return res.status(200).json({ message: "You disliked an answer." });
    } else {
      // If not following, like the answer
      await Like.create({
        userId: userId,
        entityId: answerId,
        entityType: "answer",
      });
      return res.status(201).json({ message: "You liked a answer." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like answer." });
  }
};
