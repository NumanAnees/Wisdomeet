const { DataTypes } = require("sequelize");
const sequelize = require("../src/db/db");

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
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, { foreignKey: "userId" });
    // Create associations for both questions and answers
    Like.belongsTo(models.Question, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "question" },
    });
    Like.belongsTo(models.Answer, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "answer" },
    });
  };

  return Like;
};
