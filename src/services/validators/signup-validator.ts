// Third
import { body, ValidationError } from "express-validator";

class SignUpValidator {
  public getValidationChain() {
    return [
      body(["firstname", "lastname"])
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Names are required files")
        .isString()
        .withMessage("Names fields only must contain alphabetical characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Names fields must not be empty")
        .matches(/[a-zA-Z]/)
        .withMessage("Names fields only must contain alphabetical characters")
        .isLength({ min: 2 })
        .withMessage("Names fields must be at least 2 characters")
        .isLength({ max: 50 })
        .withMessage("Names fields must be at max 30 characters"),

      body("username")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Username is a required field")
        .isString()
        .withMessage("Username field only must contain characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Username field must not be empty")
        .isLength({ min: 2 })
        .withMessage("Username field must be at least 2 characters")
        .isLength({ max: 50 })
        .withMessage("Username field must be at max 50 characters"),

      body("email")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Email is a required field")
        .isString()
        .withMessage("Email field only must contain alphabetical characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Email field must not be empty")
        .isEmail()
        .withMessage("Email entered is invalid"),

      body("password")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Password is a required field")
        .isString()
        .withMessage("Password field only must contain characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Password field must be not empty")
        .isLength({ min: 8 })
        .withMessage("Password field must be at least 8 characters")
        .isLength({ max: 72 })
        .withMessage("Password field must be at max 30 characters")
        .matches(/\d{1,}/)
        .withMessage("Password field must contain at least 1 number")
        .matches(/([a-z]){1,}/)
        .withMessage(
          "Password field must contain at least 1 lowercase alphabetical character"
        )
        .matches(/([A-Z]){1,}/)
        .withMessage(
          "Password field must contain at least 1 uppercase alphabetical character"
        )
        .custom((value, { req }) => value === req.body.passwordConfirmation)
        .withMessage("Passwords must match"),
    ];
  }

  public getErrorFormater() {
    return function (error: ValidationError) {
      return {
        location: error.location,
        message: error.msg,
        param: error.param,
        value: error.value,
        nestedErrors: error.nestedErrors,
      };
    };
  }
}

const signUpValidator = new SignUpValidator();

export default signUpValidator;
