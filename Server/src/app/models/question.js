const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
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

Question.associate = (models) => {
  Question.belongsTo(models.Topic);
  Question.belongsTo(models.User);
  Question.hasMany(models.Answer);
  Question.hasMany(models.Like, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
      entityType: "question",
    },
  });
  Question.hasMany(models.Dislike, {
    foreignKey: "entityId",
    constraints: false,
    scope: {
      entityType: "question",
    },
  });
};

module.exports = Question;
