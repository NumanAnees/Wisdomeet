"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "user@example.com",
          password: "hashedpassword", // Replace with actual hashed password
          name: "John Doe",
          age: 25,
          gender: "male",
          profilePic: "profile-pic.jpg", // Replace with actual file name
          role: "user",
        },
        // Add more users as needed
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
