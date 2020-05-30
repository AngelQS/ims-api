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

/* const error = validationResult(req)
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
console.log("NEW ERROR:", newError); */

class AuthMiddlewares {
  public grantUserSignUp(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Getting user data from HTTPRequest
      const { firstname, lastname, username, email, password } = req.body;

      // Verifying if user exists
      const userExists = await User.exists({ email });

      // Throwing error if user already exists
      if (userExists) {
        return reject(Error("Email entered is already taken"));
      }

      // Saving user
      const newUser = await new User({
        firstname,
        lastname,
        username,
        email,
        password,
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

  public grantUserLogIn(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve: Function, reject: Function) => {
      // Getting request body
      const { email, password } = req.body;

      // Checking if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return reject(Error("Email entered does not exist"));
      }

      const userPassword = user.get("password");

      // Checking data
      const validPassword = await new BcryptService(
        password,
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

  public requiresAuthorization(
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

const authMiddlewares = new AuthMiddlewares();

export default authMiddlewares;
