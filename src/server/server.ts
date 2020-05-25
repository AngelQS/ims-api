// Third
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import { config as dotenv } from "dotenv";

// Initializations
const PORT = 3000;

export default class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    dotenv();
  }

  protected config(): void {
    this.app.set("port", PORT);

    // Middlewares
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(morgan("dev"));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  routes() {
    this.app.get("/home", (req: Request, res: Response, next: NextFunction) => {
      res.send("Hello Man");
    });
  }

  start() {
    this.app.listen(this.app.get("port"), () => {
      console.log(`>> Server running on port ${this.app.get("port")}`);
    });
  }
}
