const { Like, Answer, Dislike } = require("../../../models");
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_NOT_ALLOWED,
} = require("../helpers/constants");

exports.createAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    const questionId = req.params.id;
    const userId = req.user.id;

    const newAnswer = await Answer.create({
      text,
      userId,
      questionId,
    });

    res.status(HTTP_STATUS_CREATED).json(newAnswer);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to create the answer" });
  }
};

exports.updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Answer not found" });
    }

    if (existingAnswer.userId !== userId) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({ error: "You are not authorized to update this answer" });
    }

    await existingAnswer.update({
      text,
    });

    res.status(HTTP_STATUS_OK).json(existingAnswer);
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to update the answer" });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingAnswer = await Answer.findByPk(id);

    if (!existingAnswer) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Answer not found" });
    }

    if (existingAnswer.userId !== userId) {
      return res.status(HTTP_STATUS_NOT_ALLOWED).json({ error: "You are not authorized to delete this answer" });
    }

    await existingAnswer.destroy();

    res.status(HTTP_STATUS_OK).json({ message: "Answer deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ error: "Unable to delete the answer" });
  }
};

exports.LikeAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const answerId = req.params.id;

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Answer not found." });
    }
    const existingLike = await Like.findOne({
      where: { userId: userId, answerId: answerId, entityType: "answer" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(HTTP_STATUS_OK).json({ message: "Like Removed." });
    } else {
      await Like.create({
        userId: userId,
        answerId: answerId,
        entityType: "answer",
      });
      return res.status(HTTP_STATUS_CREATED).json({ message: "Like Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to like answer." });
  }
};

exports.DislikeAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const answerId = req.params.id;

    const answer = await Answer.findByPk(answerId);
    if (!answer) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Answer not found." });
    }
    const existingLike = await Dislike.findOne({
      where: { userId: userId, answerId: answerId, entityType: "answer" },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(HTTP_STATUS_OK).json({ message: "Dislike Removed." });
    } else {
      await Dislike.create({
        userId: userId,
        answerId: answerId,
        entityType: "answer",
      });
      return res.status(HTTP_STATUS_CREATED).json({ message: "Dislike Added." });
    }
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: "Failed to like answer." });
  }
};
