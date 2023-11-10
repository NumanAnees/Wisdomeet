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
        required: true,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
    },
    { timestamps: false }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Question.belongsTo(models.Topic, { foreignKey: "topicId" });

    Question.hasMany(models.Answer, {
      foreignKey: "questionId",
      onDelete: "CASCADE",
      as: "answers",
    });
    Question.hasMany(models.Like, {
      foreignKey: "questionId",
      constraints: false,
      onDelete: "CASCADE",
      scope: { entityType: "question" },
      as: "likes",
    });
    Question.hasMany(models.Dislike, {
      foreignKey: "questionId",
      constraints: false,
      onDelete: "CASCADE",
      scope: { entityType: "question" },
      as: "dislikes",
    });
  };

  return Question;
};
