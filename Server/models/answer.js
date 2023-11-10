const { DataTypes } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  const Answer = sequelize.define(
    "Answer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.STRING,
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
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
    },
    {
      timestamps: false,
    }
  );
  Answer.associate = (models) => {
    Answer.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Answer.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question",
      onDelete: "CASCADE",
    });

    Answer.hasMany(models.Like, {
      foreignKey: "answerId",
      constraints: false,
      scope: { entityType: "answer" },
      as: "likes",
      onDelete: "CASCADE",
    });
    Answer.hasMany(models.Dislike, {
      foreignKey: "answerId",
      constraints: false,
      scope: { entityType: "answer" },
      as: "dislikes",
      onDelete: "CASCADE",
    });
  };

  return Answer;
};
