const { DataTypes } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  const Question = sequelize.define(
    "Question",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Question.belongsTo(models.Topic, { foreignKey: "topicId" });

    Question.hasMany(models.Answer, {
      foreignKey: "questionId",
      as: "answers", // Add alias "answers" here
    });
    Question.hasMany(models.Like, {
      foreignKey: "questionId",
      constraints: false,
      scope: { entityType: "question" },
      as: "likes", // Add alias "answers" here
    });
    Question.hasMany(models.Dislike, {
      foreignKey: "questionId",
      constraints: false,
      scope: { entityType: "question" },
      as: "dislikes", // Add alias "answers" here
    });
  };

  return Question;
};
