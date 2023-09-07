const { DataTypes } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  const Like = sequelize.define(
    "Like",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["question", "answer"]],
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true,
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    { timestamps: false }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Like.belongsTo(models.Question, {
      foreignKey: "questionId",
      constraints: false,
      scope: { entityType: "question" },
    });
    Like.belongsTo(models.Answer, {
      foreignKey: "answerId",
      constraints: false,
      scope: { entityType: "answer" },
    });
  };

  return Like;
};
