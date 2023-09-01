"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Topics",
      [
        {
          title: "Technology",
          description: "Discussions about technology trends",
          topicPicture: "tech-topic.jpg", // Replace with actual file name
          createdBy: 1, // Assuming user with ID 1 created this topic
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // Add more topics as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Topics", null, {});
  },
};
