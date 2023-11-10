"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Dislikes", [
      {
        userId: 1,
        entityType: "question",
        questionId: 1,
        answerId: null,
      },
      {
        userId: 1,
        entityType: "answer",
        questionId: null,
        answerId: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Dislikes", null, {});
  },
};
