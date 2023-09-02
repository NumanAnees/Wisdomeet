"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Topics", [
      {
        title: "Sample Topic 1",
        description: "Description of Sample Topic 1",
        topicPicture: "sample-topic1.jpg",
        createdBy: 1, // Replace with an existing user's ID
      },
      {
        title: "Sample Topic 2",
        description: "Description of Sample Topic 2",
        topicPicture: "sample-topic2.jpg",
        createdBy: 1, // Replace with another existing user's ID
      },
      // Add more topics as needed
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Topics", null, {});
  },
};
