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
      const errors = validationResult(req)
        .formatWith(signUpErrorFormater())
        .array({ onlyFirstError: true });
      if (errors.length > 0) {
        console.log("ERRORS:", errors[0]);
        throw new Error("Validation Errors");
      }

      const userData = req.body;

      const userExists = await User.exists({ email: userData.email });

      if (userExists) {
        throw new Error("Email entered is already taken");
      }
      console.log("hashing");
      const passwordHashed = BcryptService.hash(userData.password);
      console.log("hashed");
      userData.password = passwordHashed;

      const newUser = new User(userData);

      await newUser.save();
      return res.json({ message: "Successfully signed up", user: newUser });
    } catch (err) {
      return next(err);
    }
  }

  public async grantUserLogIn(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("HI");
      const errors = validationResult(req).array({ onlyFirstError: true });

      console.log("ERRORS:", errors);
      if (errors.length > 0) {
        throw new Error("Validation Errors");
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Email entered does not exist");
      }

      const userPassword = user.get("password");
      console.log("antes bcrypt");
      const validPassword = await BcryptService.compare(password, userPassword);
      console.log("despues bcrypt");
      if (!validPassword) {
        throw new Error("Invalid user password");
      }
      console.log("PASO IF");
      const userPayload = {
        _id: user.get("_id"),
        email: user.get("email"),
      };
      console.log("payload:", userPayload);
      const userToken = await JsonWebTokenService.sign(userPayload);
      console.log("userToken:", userToken);
      return res.json({ message: "Successfully loged in", token: userToken });
    } catch (err) {
      res.json({ message: `${err}` });
      return next(err);
    }
  }

  public async requiresAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { authorization } = req.headers;
      console.log("authorization:", authorization);
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
      console.log("_id:", _id);
      const user = await User.findById(_id);

      if (!user) {
        return res.json({ error: "User not found" });
      }
      console.log("user:", user);
      res.locals.bearer.user = user;
      console.log("res.locals.bearer.user:", res.locals.bearer.user);
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

const authMiddlewares = new AuthMiddlewares();

export default authMiddlewares;
