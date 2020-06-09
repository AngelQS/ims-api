// Third
import { body, ValidationError } from "express-validator";

class PostValidator {
  public getValidationChain() {
    return [
      body("title")
        .optional({ nullable: true })
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Title field are required")
        .isAscii()
        .withMessage("Tittle field must contain ascii characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Title field must not be empty")
        .isLength({ min: 0 })
        .withMessage("Title field must be at least 0 characters")
        .isLength({ max: 200 })
        .withMessage("Title field must be at max 200 characters"),

      body("body")
        .optional({ nullable: true })
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Body field is required")
        .isAscii()
        .withMessage("Body field must contain ascii characters")
        .trim()
        .not()
        .isEmpty({ ignore_whitespace: true })
        .withMessage("Body field must not be empty")
        .isLength({ min: 0 })
        .withMessage("Body field must be at least 0 characters")
        .isLength({ max: 500 })
        .withMessage("Body field must be at max 500 characters"),

      body("photo")
        .optional({ nullable: true })
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage("Photo is a required field"),
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

const postValidator = new PostValidator();

export default postValidator;
