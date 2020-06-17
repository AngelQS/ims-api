// Third
import { Router } from "express";

// Local
import UserMiddlewares from "../middlewares/user.middlewares";
import AuthMiddlewares from "../middlewares/auth.middlewares";

// Initialization
const { requiresAuthorization } = AuthMiddlewares;
const { getUserProfile } = UserMiddlewares;

class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/:_id", requiresAuthorization, getUserProfile);
  }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;
