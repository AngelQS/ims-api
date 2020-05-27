// Third
import { Request, Response, NextFunction } from "express";

// Local
import User from "../models/User";

export default class UserMiddlewares {
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

      await newUser.save({});

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
