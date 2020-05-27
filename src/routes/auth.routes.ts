// Third
import { Router } from "express";

// Local
import AuthControllers from "../controllers/auth.ctrl";
import UserMiddlewares from "../middlewares/user.middlewares";
import AuthMiddlewares from "../middlewares/auth.middlewares";

// Initializations
const { redirectTo, getProtected } = AuthControllers;
const { saveUserOnDatabase } = UserMiddlewares;
const {
  getRequest,
  signUpDataValidation,
  logInDataValidation,
  requiresToken,
} = AuthMiddlewares;

class AuthRoutes {
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

    this.router.post("/login", getRequest, logInDataValidation);
    this.router.get("/protected", requiresToken, getProtected);
  }
}

const authRoutes = new AuthRoutes();

export default authRoutes.router;
