"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Questions", [
      {
        text: "What is your favorite programming language?",
        userId: 1, // Replace with an existing user's ID
        topicId: 1, // Replace with an existing topic's ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more questions here
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Questions", null, {});
  },
};
