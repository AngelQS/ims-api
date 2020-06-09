// Third
import { Request, Response, NextFunction } from "express";

// Local
import EnvironmentVariables from "../services/config/environment-variables";
import ErrorCourier from "../services/errors/errors.service";
import Error from "../models/Error";

// Initializations
const { NODE_ENV: ENV } = EnvironmentVariables;

class ErrorMiddlewares {
  public async errorHandler(
    err: ErrorCourier,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    await new Error(err).save();
    if (ENV === "production") {
      return res.render("some view");
    }
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

const errorMiddlewares = new ErrorMiddlewares();

export default errorMiddlewares;
