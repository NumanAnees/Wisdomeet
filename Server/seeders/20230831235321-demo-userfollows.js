"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "UserFollows",
      [
        {
          userId: 1, // Assuming user with ID 1 is following
          topicId: 1, // Assuming topic with ID 1
        },
        // Add more user follows as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("UserFollows", null, {});
  },
};
