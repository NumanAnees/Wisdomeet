"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Likes", [
      {
        userId: 1,
        entityType: "question",
        entityId: 1,
      },
      {
        userId: 1,
        entityType: "question",
        entityId: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
