// Third
import { Router } from "express";

// Local
import UserController from "../controllers/user.ctrl";
import UserMiddlewares from "../middlewares/user.middlewares";
import AuthMiddlewares from "../middlewares/auth.middlewares";

// Initializations
const { redirectTo } = UserController;
const { signUpDataValidation, saveUserOnDatabase } = UserMiddlewares;
const { getRequest } = AuthMiddlewares;

class UserRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/signup",
      getRequest,
      signUpDataValidation,
      saveUserOnDatabase,
      redirectTo
    );
  }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;
