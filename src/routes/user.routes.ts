// Third
import { Router } from "express";

class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    // TODO: user routes
  }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;
