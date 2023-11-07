const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

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
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.Question, {
      foreignKey: "entityId",
      constraints: false,
      scope: { entityType: "question" },
    });
  };

  return Like;
};
