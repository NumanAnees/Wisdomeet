"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("UserFollows", [
      {
        userId: 1,
        topicId: 1,
      },
      {
        userId: 1,
        topicId: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("UserFollows", null, {});
  },
};
