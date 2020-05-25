// Third
import { Request, Response, NextFunction } from "express";

// Local
import BcryptService from "../services/hashing/bcrypt.service";
import User from "../models/User";
import validator from "../utils/validator";
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
      const bodyData = res.locals.HTTPRequest.body;

      // Clean and validate user data
      const cleanData = trimData(bodyData);
      const validData = validator(cleanData);

      // Hashing data
      const hashedEmail = new BcryptService(validData.email).hash();
      const hashedPassword = new BcryptService(validData.password).hash();

      const userData = {
        name: validData.name,
        email: hashedEmail,
        password: hashedPassword,
      };

      // Returning user data if its valid
      return resolve(userData);
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
