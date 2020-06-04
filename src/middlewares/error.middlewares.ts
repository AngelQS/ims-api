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
    const error = err instanceof ErrorCourier ? err.getError() : err;
    await new Error(error).save();

    if (ENV === "production") {
      // TODO: Save error on db
      return res.render("some view");
    }
    return res.json({ error });
  }
}

const errorMiddlewares = new ErrorMiddlewares();

export default errorMiddlewares;
