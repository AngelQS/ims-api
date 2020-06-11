// Third
import { Request, Response, NextFunction } from "express";

// Local
import ErrorCourier from "../services/errors/errors.service";
import Error from "../models/Error";
import { configService } from "../services/config/config.service";
import { CONFIG_SYMBOLS } from "../services/config/config.constants";

// Initializations
const ENV = configService.getProperty(CONFIG_SYMBOLS.NODE_ENV);

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
    return res.status(500).json({ error: "Something went wrong" });
  }
}

const errorMiddlewares = new ErrorMiddlewares();

export default errorMiddlewares;
