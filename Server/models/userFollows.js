const { DataTypes } = require("sequelize");

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
        required: true,
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
    },
    { timestamps: false }
  );

  UserFollows.associate = (models) => {
    UserFollows.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    UserFollows.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE",
    });
  };

  return UserFollows;
};
