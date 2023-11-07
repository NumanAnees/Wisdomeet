const { check } = require("express-validator");

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must 6 to 20 characters long"),
];

exports.userRegisterValidator = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 to 20 characters long"),
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must 6 to 20 characters long"),
  check("age")
    .isInt({ min: 1, max: 149 })
    .withMessage("Age must be a number between 1 and 149"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage('Gender must be either "male" or "female"'),
];

exports.userUpdateValidator = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must 3 to 20 characters long"),
  check("age")
    .isInt({ min: 1, max: 149 })
    .withMessage("Age must be a number between 1 and 149"),
  check("gender")
    .isIn(["male", "female"])
    .withMessage('Gender must be either "male" or "female"'),
  check("password")
    .optional({ checkFalsy: true })
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must 6 to 20 characters long"),
];
