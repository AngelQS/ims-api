// Third
import { Router } from "express";

// Local
import IndexController from "../controllers/index.ctrl";
import AuthMiddlewares from "../middlewares/auth.middlewares";

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", IndexController.getIndex);
  }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;
