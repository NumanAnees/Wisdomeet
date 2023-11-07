"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed some example data into the Likes table
    await queryInterface.bulkInsert("Likes", [
      {
        userId: 1,
        entityType: "question",
        questionId: 1, // Replace with the actual question ID you want to like
        answerId: null, // Set to null since it's a question like
      },
      {
        userId: 1,
        entityType: "answer",
        questionId: null, // Set to null since it's an answer like
        answerId: 1, // Replace with the actual answer ID you want to like
      },
      // Add more likes as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data from the Likes table
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
