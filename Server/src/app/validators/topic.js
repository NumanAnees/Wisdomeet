const { check } = require("express-validator");

exports.topicValidator = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must 3 to 100 characters long"),
  check("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Description is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Description must 3 to 100 characters long"),
];
