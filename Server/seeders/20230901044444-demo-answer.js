"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Answers", [
      {
        text: "Sample Answer 1",
        userId: 2, // Change this to the appropriate user ID
        questionId: 1, // Change this to the appropriate question ID
      },
      {
        text: "Sample Answer 2",
        userId: 2, // Change this to the appropriate user ID
        questionId: 2, // Change this to the appropriate question ID
      },
      // Add more sample answers as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the seeded data
    await queryInterface.bulkDelete("Answers", null, {});
  },
};
