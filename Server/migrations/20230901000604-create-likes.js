"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Likes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [["question", "answer"]],
        },
      },
      questionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Questions",
          key: "id",
        },
      },
      answerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Answers",
          key: "id",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Likes");
  },
};
