// Third
import { body, ValidationError } from "express-validator";

class SignUpValidator {
  public getValidationChain() {
    return [
      body("username")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Username is a required field")
        .isAlphanumeric("sr-RS@latin")
        .withMessage("Username field only allow alphanumeric characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Username field must not be empty")
        .isLength({ min: 2 })
        .withMessage("Username field must be at least 2 characters")
        .isLength({ max: 30 })
        .withMessage("Username field must be at max 30 characters"),

      body("name")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Name is a required field")
        .isString()
        .withMessage("Name field only allows letters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Name field must not be empty")
        .isLength({ min: 2 })
        .withMessage("Name field must be at least 2 characters")
        .isLength({ max: 30 })
        .withMessage("Name field must be at max 30 characters"),

      body("email")
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Email is a required field")
        .isString()
        .withMessage("Email field only allows letters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Email field must not be empty")
        .isEmail()
        .withMessage("Email entered is invalid"),
    ];
  }

  public getErrorFormater() {
    return function (error: ValidationError) {
      return {
        type: "ValidationError",
        name: "Signup failure",
        location: error.location,
        message: error.msg,
        param: error.param,
        value: error.value,
        nestedErrors: error.nestedErrors,
        context: "none",
      };
    };
  }
}

const signUpValidator = new SignUpValidator();

export default signUpValidator;
