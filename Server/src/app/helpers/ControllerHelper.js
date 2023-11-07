//Libraries imports
const cloudinary = require("../helpers/cloudinary.js");
const { Op } = require("sequelize");

const {
  User,
  Topic,
  Question,
  UserFollows,
  Like,
  Answer,
  Dislike,
} = require("../../../models");

exports.QuestionHelper = async (QuestionId, userId) => {
  const question = await Question.findByPk(QuestionId, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "profilePic"],
      },
      {
        model: Like,
        as: "likes",
        attributes: ["userId"],
      },
      {
        model: Dislike,
        as: "dislikes",
        attributes: ["userId"],
      },
    ],
  });

  if (!question) {
    return null;
  }

  const {
    id,
    text,
    likes,
    dislikes,
    user: { name: userName, profilePic: userPic } = {},
  } = question;

  const userLiked = question.likes.some((like) => like.userId == userId);
  const userDisliked = question.dislikes.some(
    (dislike) => dislike.userId == userId
  );
  return {
    id,
    name: userName ?? "No name",
    picture: userPic ?? "default-profile-pic.jpg",
    text,
    likes: likes.length,
    dislikes: dislikes.length,
    isLiked: userLiked,
    isDisliked: userDisliked,
  };
};
