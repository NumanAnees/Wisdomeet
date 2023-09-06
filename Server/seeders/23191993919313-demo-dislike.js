"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Likes", [
      {
        userId: 2,
        entityType: "question",
        entityId: 5,
      },
      {
        userId: 2,
        entityType: "question",
        entityId: 6,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
