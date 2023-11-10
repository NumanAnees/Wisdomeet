"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
          len: [3, 20],
        },
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true,
        validate: {
          isInt: true,
          min: 1,
          max: 149,
        },
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
        validate: {
          notEmpty: true,
          isIn: [["male", "female"]],
        },
      },
      profilePic: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          notEmpty: true,
          isIn: [["admin", "user"]],
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
