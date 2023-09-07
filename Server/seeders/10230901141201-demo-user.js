"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "user2@example.com",
          password: "hashedpassword",
          name: "John Doe",
          age: 25,
          gender: "male",
          profilePic: "profile-pic.jpg",
          role: "user",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
