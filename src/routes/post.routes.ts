// Third
import { Router } from "express";

// Local
import AuthMiddlewares from "../middlewares/auth.middlewares";
import PostMiddlewares from "../middlewares/post.middlewares";
import PostValidator from "../services/validators/post-validator";

// Initializations
const { requiresAuthorization } = AuthMiddlewares;
const {
  createPost,
  getAllPosts,
  getUserOwnPosts,
  likeToAPost,
  unlikeToAPost,
  commentAPost,
  deleteAPost,
} = PostMiddlewares;
const { getValidationChain: postValidationChain } = PostValidator;

class PostRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", requiresAuthorization, getAllPosts);
    //.status(422)
    this.router.post(
      "/",
      requiresAuthorization,
      postValidationChain(),
      createPost
    );
    this.router.get("/myposts", requiresAuthorization, getUserOwnPosts);
    this.router.put("/like", requiresAuthorization, likeToAPost);
    this.router.put("/unlike", requiresAuthorization, unlikeToAPost);
    this.router.put("/comment", requiresAuthorization, commentAPost);
    this.router.delete("/comment/:_id", requiresAuthorization, deleteAPost);
  }
}

const postRoutes = new PostRoutes();

export default postRoutes.router;
