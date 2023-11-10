const { DataTypes } = require("sequelize");
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
        required: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
          len: [3, 20],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        required: true,
        validate: {
          isInt: true,
          min: 1,
          max: 149,
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
          isIn: [["male", "female"]],
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
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

  User.associate = models => {
    User.hasOne(models.Topic, {
      foreignKey: "createdBy",
      as: "createdTopics",
      onDelete: "CASCADE",
    });
    User.belongsToMany(models.Topic, {
      through: models.UserFollows,
      as: "followedTopics",
      foreignKey: "userId",
    });
    User.hasMany(models.Question, {
      foreignKey: "userId",
      as: "questions",
      onDelete: "CASCADE",
      cascade: true,
    });
    User.hasMany(models.Like, {
      foreignKey: "userId",
      as: "likes",
      onDelete: "CASCADE",
      cascade: true,
    });
    User.hasMany(models.Answer, {
      foreignKey: "userId",
      as: "answers",
      onDelete: "CASCADE",
      cascade: true,
    });
    User.hasMany(models.Dislike, {
      foreignKey: "userId",
      as: "dislikes",
      onDelete: "CASCADE",
      cascade: true,
    });
  };

  User.beforeCreate(async user => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });
  User.beforeUpdate(async user => {
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
