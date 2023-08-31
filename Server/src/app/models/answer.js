const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

Answer.associate = (models) => {
  Answer.belongsTo(models.Question);
  Answer.belongsTo(models.User);
  Answer.hasMany(models.Like, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
      entityType: "answer",
    },
  });
  Answer.hasMany(models.Dislike, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
      entityType: "answer",
    },
  });
};

module.exports = Answer;
