// Third
import { Router } from "express";

// Local
import AuthControllers from "../controllers/auth.ctrl";
import AuthMiddlewares from "../middlewares/auth.middlewares";
import signUpValidator from "../services/validators/signup-validator";
import logInValidator from "../services/validators/login-validator";

// Initializations
const { getProtected } = AuthControllers;
const {
  grantUserSignUp,
  grantUserLogIn,
  requiresAuthorization,
} = AuthMiddlewares;
const { getValidationChain: signUpValidationChain } = signUpValidator;
const { getValidationChain: logInValidationChain } = logInValidator;

class AuthRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/signup", signUpValidationChain(), grantUserSignUp);

    this.router.post("/login", logInValidationChain(), grantUserLogIn);
    this.router.get("/protected", requiresAuthorization, getProtected);
  }
}

const authRoutes = new AuthRoutes();

export default authRoutes.router;
