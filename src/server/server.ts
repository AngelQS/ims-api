// Third
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { config as dotenv } from "dotenv";

// Local
import AuthRoutes from "../routes/auth.routes";
import IndexRoutes from "../routes/index.routes";
import PostRoutes from "../routes/post.routes";
import UserRoutes from "../routes/user.routes";
import ErrorMiddlewares from "../middlewares/error.middlewares";

// Initializations
const { errorHandler } = ErrorMiddlewares;

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    dotenv();
  }

  protected config(): void {
    this.app.set("port", process.env.NODE_PORT);

    // Global variables
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.bearer = {}; // Transfer data bearer
      return next();
    });

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  routes() {
    this.app.use("/account", AuthRoutes);
    this.app.use("/", IndexRoutes);
    this.app.use("/posts", PostRoutes);
    this.app.use("/user", UserRoutes);

    // Error Handler
    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`>> Server running on port ${this.app.get("port")}`);
    });
  }
}

const server = new Server();

export default server;
