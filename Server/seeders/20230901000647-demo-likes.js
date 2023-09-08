"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Likes", [
      {
        userId: 1, // Replace with an existing user's ID
        entityType: "question",
        entityId: 1, // Replace with an existing question's ID
      },
      {
        userId: 1, // Replace with another existing user's ID
        entityType: "question",
        entityId: 2, // Replace with another existing question's ID
      },
      // Add more likes as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
