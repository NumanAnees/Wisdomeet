const { check } = require("express-validator");

exports.questionValidator = [
  check("text")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Text is required")
    .isLength({ min: 3 })
    .withMessage("Text must be at least 3 characters long"),
];
