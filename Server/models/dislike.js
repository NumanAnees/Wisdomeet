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

  Dislike.associate = (models) => {
    Dislike.belongsTo(models.User, { foreignKey: "userId" });
    // Create associations for both questions and answers
    Dislike.belongsTo(models.Question, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "question" },
    });
    Dislike.belongsTo(models.Answer, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "answer" },
    });
  };

  return Dislike;
};
