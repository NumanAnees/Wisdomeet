const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

module.exports = function (sequelize, Sequelize) {
  const Dislike = sequelize.define(
    "Dislike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Dislike.associate = (models) => {
    Dislike.belongsTo(models.User, { foreignKey: "userId" });
    Dislike.belongsTo(models.Question, {
      foreignKey: "entityId",
      constraints: false,
    });
  };

  return Dislike;
};
