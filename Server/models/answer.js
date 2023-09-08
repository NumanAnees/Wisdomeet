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
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  Answer.associate = (models) => {
    Answer.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user", // Add this alias
    });
    Answer.belongsTo(models.Question, {
      foreignKey: "questionId",
      as: "question", // Add this alias
    });

    Answer.hasMany(models.Like, {
      foreignKey: "answerId",
      constraints: false,
      scope: { entityType: "answer" },
      as: "likes", // Add alias "likes" here
    });
    Answer.hasMany(models.Dislike, {
      foreignKey: "answerId",
      constraints: false,
      scope: { entityType: "answer" },
      as: "dislikes", // Add alias "dislikes" here
    });
  };

  return Answer;
};
