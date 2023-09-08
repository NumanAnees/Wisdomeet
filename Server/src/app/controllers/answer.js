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
    const userId = req.user.id;

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
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }

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
    const { id } = req.params;
    const userId = req.user.id;

    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(404).json({ error: "Answer not found" });
    }

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

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }
    const existingLike = await Like.findOne({
      where: { userId: userId, entityId: answerId, entityType: "answer" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: "You disliked an answer." });
    } else {
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
