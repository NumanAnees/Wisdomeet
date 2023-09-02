const { DataTypes } = require("sequelize");
const sequelize = require("../src/db/db");

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
    Question.belongsTo(models.User, { foreignKey: "userId" });
    Question.belongsTo(models.Topic, { foreignKey: "topicId" });
    Question.hasMany(models.Like, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "question" },
    });

    // Question.hasMany(models.Like, {
    //   foreignKey: "entityId",
    //   constraints: false,
    //   scope: {
    //     entityType: "question",
    //   },
    // });
    // Question.hasMany(models.Dislike, {
    //   foreignKey: "entityId",
    //   constraints: false,
    //   scope: {
    //     entityType: "question",
    //   },
    // });
  };

  return Question;
};