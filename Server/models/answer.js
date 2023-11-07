const { DataTypes } = require("sequelize");
const sequelize = require("../models");

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
    Answer.belongsTo(models.User, { foreignKey: "userId" });
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });

    Answer.hasMany(models.Like, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "answer" },
    });
  };

  return Answer;
};
