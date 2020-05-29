// Third
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Local
import BcryptService from "../services/hashing/bcrypt.service";
import adaptRequest from "../utils/adapt-request";
import validator from "../utils/validator";
import trimData from "../utils/trim-data";
import User from "../models/User";
import JsonWebTokenService from "../services/hashing/jsonwebtoken.service";
import signUpValidator from "../services/validators/signup-validator";

// Initializations
const { getErrorFormater: signUpErrorFormater } = signUpValidator;
const errFormat = signUpErrorFormater();

export default class AuthMiddlewares {
  static getRequest(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if request does not exist
      if (!req) {
        return reject(
          new Error("Unable to get request on AuthMiddlewares.getRequest")
        );
      }

      const error = validationResult(req)
        .formatWith(signUpErrorFormater())
        .mapped();
      const newError = {
        error,
        meta: {
          path: req.path,
          method: req.method,
          ip: req.ip,
          statusCode: 422,
          statusMessage: "Invalid body",
          context: `${AuthMiddlewares.name}.getRequest`,
        },
      };
      console.log("NEW ERROR:", newError);

      // Getting request
      const adaptedRequest = adaptRequest(req);

      return resolve(adaptedRequest);
    })
      .then((adaptedRequest): any => {
        res.locals.HTTPRequest = adaptedRequest;
        return next();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static signUpDataValidation(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.HTTPRequest.body is null
      if (!res.locals.HTTPRequest.body) {
        return reject(
          new Error(
            "Unable to get res.locals.HTTPRequest.body on UserMiddlewares.signUpDataValidation"
          )
        );
      }

      // Getting request body
      const { name, email, password } = res.locals.HTTPRequest.body;

      if (!name || !email || !password) {
        return reject(Error("There are missing fields"));
      }

      // Clean and validate user data
      const cleanData = trimData({ name, email, password });
      const validData = validator(cleanData);

      // Hashing data
      const hashedPassword = await new BcryptService(validData.password).hash();

      const userData = {
        name: validData.name,
        email: validData.email,
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

  static logInDataValidation(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.HTTPRequest.body is null
      if (!res.locals.HTTPRequest.body) {
        return reject(
          new Error(
            "Unable to get res.locals.HTTPRequest.body on UserMiddlewares.signUpDataValidation"
          )
        );
      }

      // Getting request body
      const { email, password } = res.locals.HTTPRequest.body;

      if (!email || !password) {
        return reject(Error("There are missing fields"));
      }

      // Clean and validate user data
      const cleanData = trimData({ email, password });
      const validData = validator(cleanData);

      // Checking if user exists
      const user = await User.findOne({ email: validData.email });

      if (!user) {
        return reject(Error("Invalid user email"));
      }

      const userPassword = user.get("password");

      // Checking data
      const validPassword = await new BcryptService(
        validData.password,
        userPassword
      ).compare();

      if (!validPassword) {
        return reject(Error("Invalid user password"));
      }

      // User payload
      const userPayload = {
        _id: user.get("_id"),
        email: user.get("email"),
      };

      // Generating token
      const userToken = await JsonWebTokenService.sign(userPayload);

      return resolve(userToken);
    })
      .then((userToken) => {
        res.json({ message: "Successfully loged in", token: userToken });
        return next();
      })
      .catch((err) => {
        res.json({ message: `${err}` });
        return next(err);
      });
  }

  static requiresAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    new Promise(async (resolve, reject) => {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
      }
      const bearer = authorization.split(" ");
      const token = bearer[1];

      const decoded = await JsonWebTokenService.verify(token);

      if (!decoded) {
        return res.json({ error: "You must be logged in" });
      }

      const { _id } = decoded;

      const user = await User.findById(_id);

      if (!user) {
        return res.json({ error: "User not found" });
      }

      return resolve(user);
    })
      .then((user) => {
        res.locals.userSession = user;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }
}
