// Third
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Local
import BcryptService from "../services/hashing/bcrypt.service";
import User from "../models/User";
import JsonWebTokenService from "../services/hashing/jsonwebtoken.service";
import SignUpValidator from "../services/validators/signup-validator";
import LogInValidator from "../services/validators/login-validator";
import ErrorCourier from "../services/errors/errors.service";

// Initializations
const { getErrorFormater: signUpErrorFormater } = SignUpValidator;
const { getErrorFormater: logInErrorFormater } = LogInValidator;

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
        return res.status(400).json({ error: errors[0].message });
      }

      const userData = req.body;

      const userExists = await User.exists({
        $or: [{ email: userData.email }, { username: userData.username }],
      });

      if (userExists) {
        return res
          .status(400)
          .json({ error: "Username or email already exist" });
      }

      const passwordHashed = BcryptService.hash(userData.password);

      if (!passwordHashed) {
        return res.status(500).json({ error: "Something went wrong1" });
      }

      userData.password = passwordHashed;

      const newUser = new User(userData);

      await newUser.save();

      return res
        .status(201)
        .json({ message: "Successfully signed up", user: newUser });
    } catch (err) {
      const error = new ErrorCourier({
        requestId: req.headers["ims-request-id"] as string,
        session: null,
        type: "error",
        severity: "error",
        message: "Something went wrong2",
        context: `${AuthMiddlewares.name}.grantUserSignUp`,
        iat: new Date().toISOString(),
        petition: {
          host: req.hostname,
          originalUrl: req.originalUrl,
          method: req.method,
          secure: req.secure,
          status: {
            code: 500,
            message: "Internal Server Error",
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
        },
        nestedErrors: null,
        stack: err.stack.split("Error: ")[1],
      }).getError();
      return next(error);
    }
  }

  public async grantUserLogIn(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
        .formatWith(logInErrorFormater())
        .array({ onlyFirstError: true });

      if (errors.length > 0) {
        return res.status(400).json({ error: errors[0].message });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: "Email or password are wrong" });
      }

      const userPassword = user.get("password");

      const validPassword = await BcryptService.compare(password, userPassword);

      if (!validPassword) {
        return res.status(400).json({ error: "Email or password are wrong" });
      }

      const userPayload = {
        _id: user.get("_id"),
        firstname: user.get("firstname"),
        lastname: user.get("lastname"),
        email: user.get("email"),
      };

      const userToken = await JsonWebTokenService.sign(userPayload);

      if (!userToken) {
        return res.status(500).json({ error: "Something went wrong3" });
      }
      return res.json({ message: "Successfully loged in", token: userToken });
    } catch (err) {
      const error = new ErrorCourier({
        requestId: req.headers["ims-request-id"] as string,
        session: null,
        type: "error",
        severity: "error",
        message: "Something went wrong4",
        context: `${AuthMiddlewares.name}.grantUserSignUp`,
        iat: new Date().toISOString(),
        petition: {
          host: req.hostname,
          originalUrl: req.originalUrl,
          method: req.method,
          secure: req.secure,
          status: {
            code: 500,
            message: "Internal Server Error",
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
        },
        nestedErrors: null,
        stack: err.stack.split("Error: ")[1],
      }).getError();
      return next(error);
    }
  }

  public async requiresAuthorization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        return res.status(401).json({ error: "Authorization required" });
      }
      const bearer = authorization.split(" ");
      const token = bearer[1];

      const decoded = await JsonWebTokenService.verify(token);

      if (!decoded) {
        return res.status(401).json({ error: "You must be logged in" });
      }

      const { _id } = decoded;

      const user = await User.findById(_id);

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      res.locals.bearer.user = user;

      return next();
    } catch (err) {
      const error = new ErrorCourier({
        requestId: req.headers["ims-request-id"] as string,
        session: null,
        type: "error",
        severity: "error",
        message: "Something went wrong5",
        context: `${AuthMiddlewares.name}.requiresAuthorization`,
        iat: new Date().toISOString(),
        petition: {
          host: req.hostname,
          originalUrl: req.originalUrl,
          method: req.method,
          secure: req.secure,
          status: {
            code: 500,
            message: "Internal Server Error",
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
        },
        nestedErrors: null,
        stack: err.stack.split("Error: ")[1],
      }).getError();
      return next(error);
    }
  }
}

const authMiddlewares = new AuthMiddlewares();

export default authMiddlewares;
