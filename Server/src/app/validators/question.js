const { check } = require("express-validator");

exports.questionValidator = [
  check("text")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Text is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Text must 3 to 100 characters long"),
];
