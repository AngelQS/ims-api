// Third
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Local
import BcryptService from "../services/hashing/bcrypt.service";
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
  public async grantUserSignUp(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const validationErrors = validationResult(req)
        .formatWith(signUpErrorFormater)
        .mapped();

      if (validationErrors) {
        return Error("Validation Errors");
      }

      const { userData } = req.body;

      const userExists = await User.exists({ email: userData.email });

      if (userExists) {
        return Error("Email entered is already taken");
      }

      // Saving user
      const newUser = await new User(userData);

      await newUser.save();

      return next();
    } catch (err) {
      return next(err);
    }
  }

  public async grantUserLogIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return Error("Email entered does not exist");
      }

      const userPassword = user.get("password");

      const validPassword = await new BcryptService(
        password,
        userPassword
      ).compare();

      if (!validPassword) {
        return Error("Invalid user password");
      }

      const userPayload = {
        _id: user.get("_id"),
        email: user.get("email"),
      };

      const userToken = await JsonWebTokenService.sign(userPayload);

      res.json({ message: "Successfully loged in", token: userToken });
      return next();
    } catch (err) {
      res.json({ message: `${err}` });
      return next(err);
    }
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
        res.locals.dataBearer.user = user;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }
}

const authMiddlewares = new AuthMiddlewares();

export default authMiddlewares;
