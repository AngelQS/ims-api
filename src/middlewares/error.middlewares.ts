// Third
import { Request, Response, NextFunction } from "express";

// Local
import EnvironmentVariables from "../config/environment-variables";
import ErrorCourier from "../services/errors/errors.service";

// Initializations
const { NODE_ENV: ENV } = EnvironmentVariables;

class ErrorMiddlewares {
  public async errorHandler(
    err: ErrorCourier,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("ENTRANDO EN ERROR HANDLER");
    const error = err.getError();
    if (ENV === "production") {
      // TODO: Save error on db
      return res.render("some view");
    }
    return res.json({ error });
  }
}

const errorMiddlewares = new ErrorMiddlewares();

export default errorMiddlewares;
