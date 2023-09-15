"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Dislikes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
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
        onDelete: "CASCADE",
        references: {
          model: "Questions",
          key: "id",
        },
      },
      answerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "Answers",
          key: "id",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Dislikes");
  },
};
