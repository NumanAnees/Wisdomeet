const { DataTypes } = require("sequelize");
const sequelize = require("../../db/db");
const bcrypt = require("bcrypt");

module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255], // Minimum length of 6 characters
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 255], // Minimum length of 3 characters
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1, // Minimum age of 1
          max: 149, // Maximum age of 149
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["male", "female"]],
        },
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: true,
          isIn: [["admin", "user"]],
        },
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Question);
    User.hasMany(models.Answer);
    User.belongsToMany(models.Topic, { through: models.UserTopic });
    User.hasMany(models.Like, {
      foreignKey: "userId",
      constraints: false,
      scope: {
        entityType: "user",
      },
    });
    User.hasMany(models.Dislike, {
      foreignKey: "userId",
      constraints: false,
      scope: {
        entityType: "user",
      },
    });
    User.belongsToMany(models.Topic, {
      through: models.UserFollows,
      as: "followedTopics",
      foreignKey: "userId",
    });
  };

  // Hook to hash the password before saving
  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });
  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
