module.exports = (sequelize, DataTypes) => {
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
    },
    { timestamps: false }
  );
  Topic.associate = function (models) {
    // associations can be defined here
    Topic.belongsTo(models.User, {
      foreignKey: "createdBy",
      onDelete: "CASCADE",
    });
    Topic.belongsToMany(models.User, {
      through: models.UserFollows,
      as: "followedTopics",
      foreignKey: "topicId",
    });
    Topic.hasMany(models.Question, {
      foreignKey: "topicId",
    });
  };
  return Topic;
};
