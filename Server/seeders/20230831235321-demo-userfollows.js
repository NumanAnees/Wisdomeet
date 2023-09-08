"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("UserFollows", [
      {
        userId: 1, // Replace with an existing user's ID
        topicId: 1, // Replace with an existing topic's ID
      },
      {
        userId: 1, // Replace with another existing user's ID
        topicId: 2, // Replace with the same or another existing topic's ID
      },
      // Add more follows as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("UserFollows", null, {});
  },
};
