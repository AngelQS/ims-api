// Third
import { Router } from "express";

// Local
import IndexController from "../controllers/index.ctrl";

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", IndexController.getIndex);
    this.router.post("/signup", IndexController.renderSignUp);
  }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;
