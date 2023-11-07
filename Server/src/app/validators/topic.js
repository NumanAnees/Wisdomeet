const { check } = require("express-validator");

exports.topicValidator = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  check("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Description is required")
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters long"),
];
