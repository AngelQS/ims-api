// Third
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

// Local
import EnvironmentVariables from "../config/environment-variables";
import AuthRoutes from "../routes/auth.routes";
import IndexRoutes from "../routes/index.routes";
import PostRoutes from "../routes/post.routes";
import UserRoutes from "../routes/user.routes";

// Initializations
const { NODE_PORT: PORT } = EnvironmentVariables;

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  protected config(): void {
    this.app.set("port", PORT);

    // Global variables
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.bearer = {}; // Transfer data bearer
      return next();
    });

    // Middlewares
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.cookie("X-Request-Id", uuidv4());
      res.setHeader("X-Request-Date", Date.now().toString());
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
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`>> Server running on port ${this.app.get("port")}`);
    });
  }
}

const server = new Server();

export default server;
