"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Questions", [
      {
        text: "Sample question 1",
        userId: 1,
        topicId: 1,
      },
      {
        text: "Sample question 2",
        userId: 1,
        topicId: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Questions", null, {});
  },
};
