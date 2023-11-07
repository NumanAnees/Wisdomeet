"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Answers", [
      {
        text: "Sample Answer 1",
        userId: 2,
        questionId: 1,
      },
      {
        text: "Sample Answer 2",
        userId: 2,
        questionId: 2,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Answers", null, {});
  },
};
