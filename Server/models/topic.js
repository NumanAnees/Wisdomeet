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
        required: true,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      topicPicture: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
      },
    },
    { timestamps: false }
  );
  Topic.associate = function (models) {
    Topic.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "user",
      onDelete: "CASCADE",
    });
    Topic.belongsToMany(models.User, {
      through: models.UserFollows,
      as: "followedTopics",
      foreignKey: "topicId",
    });
    Topic.hasMany(models.Question, {
      foreignKey: "topicId",
      as: "questions",
      onDelete: "CASCADE",
    });
  };
  return Topic;
};
