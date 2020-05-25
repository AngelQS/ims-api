// Third
import { Request, Response, NextFunction } from "express";

// Local
import User from "../models/User";
import isValidEmail from "../utils/is-valid-email";
import isValidName from "../utils/is-valid-name";
import isValidPassword from "../utils/is-valid-password";
import trimData from "../utils/trim-data";

export default class UserMiddlewares {
  static signUpDataValidation(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.HTTPRequest.body is null
      if (!res.locals.HTTPRequest.body) {
        return reject(
          Error(
            "Unable to get res.locals.HTTPRequest.body on UserMiddlewares.signUpDataValidation"
          )
        );
      }

      // Getting request body
      let { name, email, password } = res.locals.HTTPRequest.body;

      // Trim user data
      name = trimData(name);
      email = trimData(email);
      password = trimData(password);

      // Validating the user
      if (!isValidName(name)) {
        return reject(Error("Name entered is invalid"));
      }

      if (!isValidEmail(email)) {
        return reject(Error("Email address entered is invalid"));
      }

      if (!isValidPassword(password)) {
        return reject(Error("Password entered is invalid"));
      }

      // Returning user data if its valid
      return resolve(res.locals.HTTPRequest.body);
    })
      .then((userData) => {
        res.locals.userData = userData;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }

  static saveUserOnDatabase(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.userData is null
      if (!res.locals.userData) {
        return reject(
          Error(
            "Unable to get res.locals.userData on UserMiddlewares.saveUserOnDatabase"
          )
        );
      }

      // Getting user data from HTTPRequest
      const userData = res.locals.userData;

      // Verifying if user exists
      const userExists = await User.exists({ email: userData.email });

      // Throwing error if user already exists
      if (userExists) {
        return reject(Error("Email entered is already taken"));
      }

      // Saving user
      const newUser = await new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      await newUser.save();

      return resolve();
    })
      .then(() => {
        res.locals.redirectTo = "login";
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
