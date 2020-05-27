// Third
import { Router } from "express";

// Local
import AuthMiddlewares from "../middlewares/auth.middlewares";
import PostMiddlewares from "../middlewares/post.middlewares";

// Initializations
const { getRequest, requiresAuthorization } = AuthMiddlewares;
const { createPost, getAllPosts, getUserOwnPosts } = PostMiddlewares;

class PostRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", requiresAuthorization, getAllPosts);
    this.router.post("/", getRequest, requiresAuthorization, createPost);
    this.router.get("/myposts", requiresAuthorization, getUserOwnPosts);
  }
}

const postRoutes = new PostRoutes();

export default postRoutes.router;
