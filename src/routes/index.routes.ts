// Third
import { Router } from "express";

class IndexRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/");
  }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;
