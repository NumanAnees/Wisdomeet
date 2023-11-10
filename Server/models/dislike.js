const { DataTypes } = require("sequelize");

module.exports = function (sequelize, Sequelize) {
  const Dislike = sequelize.define(
    "Dislike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
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

  Dislike.associate = (models) => {
    Dislike.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Dislike.belongsTo(models.Question, {
      foreignKey: "questionId",
      onDelete: "CASCADE",
      constraints: false,
      scope: { entityType: "question" },
    });
    Dislike.belongsTo(models.Answer, {
      foreignKey: "answerId",
      onDelete: "CASCADE",
      constraints: false,
      scope: { entityType: "answer" },
    });
  };

  return Dislike;
};
