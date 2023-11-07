const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");

module.exports = function (sequelize, Sequelize) {
  const Topic = sequelize.define(
    "Topic",
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
        allowNull: false,
      },
      topicPicture: {
        type: DataTypes.STRING,
      },
      createdBy: {
        type: DataTypes.INTEGER,
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

  Topic.associate = (models) => {
    Topic.hasMany(models.Question);
    Topic.belongsToMany(models.User, {
      through: models.UserFollows,
      as: "followers",
      foreignKey: "topicId",
    });
    Topic.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };

  return Topic;
};
