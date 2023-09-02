const { DataTypes } = require("sequelize");
const sequelize = require("../src/db/db");

module.exports = function (sequelize, Sequelize) {
  const UserFollows = sequelize.define(
    "UserFollows",
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
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  UserFollows.associate = (models) => {
    UserFollows.belongsTo(models.User, { foreignKey: "userId" });
    UserFollows.belongsTo(models.Topic, { foreignKey: "topicId" });
  };

  return UserFollows;
};
