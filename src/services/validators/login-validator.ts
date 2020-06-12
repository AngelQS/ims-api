// Third
import { body, ValidationError } from "express-validator";

class LogInValidator {
  public getValidationChain() {
    return [
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
        .isAscii()
        .withMessage("Password field must contain ascii characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Password field must be not empty"),
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

const logInValidator = new LogInValidator();

export default logInValidator;
