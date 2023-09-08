"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Questions", [
      {
        text: "Sample question 1",
        userId: 1, // Replace with an existing user's ID
        topicId: 1, // Replace with an existing topic's ID
      },
      {
        text: "Sample question 2",
        userId: 1, // Replace with another existing user's ID
        topicId: 1, // Replace with the same or another existing topic's ID
      },
      // Add more questions as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Questions", null, {});
  },
};
