// Third
import { Router } from "express";

// Local
import AuthMiddlewares from "../middlewares/auth.middlewares";
import PostMiddlewares from "../middlewares/post.middlewares";
import PostValidator from "../services/validators/post-validator";

// Initializations
const { requiresAuthorization } = AuthMiddlewares;
const { createPost, getAllPosts, getUserOwnPosts } = PostMiddlewares;
const { getValidationChain: postValidationChain } = PostValidator;

class PostRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", requiresAuthorization, getAllPosts);
    this.router.post(
      "/",
      requiresAuthorization,
      postValidationChain(),
      createPost
    );
    this.router.get("/myposts", requiresAuthorization, getUserOwnPosts);
  }
}

const postRoutes = new PostRoutes();

export default postRoutes.router;
