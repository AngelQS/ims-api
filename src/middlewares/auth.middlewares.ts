// Third
import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

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
      console.log("EL BODY:", req.body);
      console.log("req.headers:", req.headers);

      if (errors.length > 0) {
        const errorCourier = new ErrorCourier("Invalid Signup", {
          request: {
            id: req.headers["ims-request-id"] as string,
            iat: req.headers["ims-request-date"] as string,
          },
          session: null,
          type: "Client Error",
          severity: "Alarm",
          message: "Validation Error",
          status: {
            code: 401,
            message: "Unauthorized",
          },
          method: req.method,
          complete: req.complete,
          host: req.hostname,
          originalUrl: req.originalUrl,
          secure: req.secure,
          context: {
            name: `${AuthMiddlewares.name}.grantUserSignUp`,
            path: __dirname,
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
          errorIat: new Date().toISOString(),
          nestedErrors: errors[0],
          stack: null,
        });
        return next(errorCourier);
      }

      const userData = req.body;

      const userExists = await User.exists({ email: userData.email });

      if (userExists) {
        throw new Error("Email entered is already taken");
      }

      const passwordHashed = BcryptService.hash(userData.password);

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
      const errors = validationResult(req)
        .formatWith(logInErrorFormater())
        .array({ onlyFirstError: true });

      if (errors.length > 0) {
        const errorCourier = new ErrorCourier("Invalid Login", {
          request: {
            id: req.headers["X-Request-Id"] as string,
            iat: req.headers["X-Request-Date"] as string,
          },
          session: null,
          type: "Client Error",
          severity: "Alarm",
          message: "Validation Error",
          status: {
            code: 403,
            message: "Forbidden",
          },
          method: req.method,
          complete: req.complete,
          host: req.hostname,
          originalUrl: req.originalUrl,
          secure: req.secure,
          context: {
            name: `${AuthMiddlewares.name}.grantUserLogIn`,
            path: __dirname,
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
          errorIat: new Date().toISOString(),
          nestedErrors: errors[0],
          stack: null,
        });
        return next(errorCourier);
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Email entered does not exist");
      }

      const userPassword = user.get("password");

      const validPassword = await BcryptService.compare(password, userPassword);

      if (!validPassword) {
        throw new Error("Invalid user password");
      }

      const userPayload = {
        _id: user.get("_id"),
        email: user.get("email"),
      };

      const userToken = await JsonWebTokenService.sign(userPayload);

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
      console.log("X-Request-ID:", req.headers['X-Request-Id"]']);
      console.log("X-Request-Date:", req.headers["X-Request-Date"]);
      if (!authorization) {
        const errorCourier = new ErrorCourier("Invalid Login", {
          request: {
            id: req.headers["X-Request-Id"] as string,
            iat: req.headers["X-Request-Date"] as string,
          },
          session: null,
          type: "Client Error",
          severity: "Warning",
          message: "Authorization Error",
          status: {
            code: 401,
            message: "Unauthorized",
          },
          method: req.method,
          complete: req.complete,
          host: req.hostname,
          originalUrl: req.originalUrl,
          secure: req.secure,
          context: {
            name: `${AuthMiddlewares.name}.requiresAuthorization`,
            path: __dirname,
          },
          headers: {
            contentType: req.headers["content-type"] as string,
            userAgent: req.headers["user-agent"] as string,
          },
          errorIat: new Date().toISOString(),
          nestedErrors: null,
          stack: null,
        });
        return next(errorCourier);
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

      res.locals.bearer.user = user;

      return next();
    } catch (err) {
      return next(err);
    }
  }
}

const authMiddlewares = new AuthMiddlewares();

export default authMiddlewares;

// ERROR HANDLING

/* export interface IResponse<T> {
  data: T;
  error: Error;
  timestamp: string;
}

class Reponse<T> {
  private readonly data: T;
  private readonly error: Error = null;
  private readonly timestamp: string = new Date().toISOString();

  constructor(private readonly response: IResponse<T>) {

  }

  getData() {}
  getError() {}
  getTimestamp() {}
  
}

fn(req, res) {
  const user = fromDatabase(id);
  const response = new Response<User>({
    data: user,
  })
  res.json(response);
}

body,
headers,
error: {
  data: null,
  error: {
    error: 'NOT FOUND'
  },
  timestamp: string,
} */
