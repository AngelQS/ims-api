// Third
import { Request, Response, NextFunction } from "express";

// Local
import Post from "../models/Post";

class PostMiddlewares {
  public async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.dataBearer.user) {
        return Error(
          "Unable to get res.locals.dataBearer.user on PostMiddlewares.createPost"
        );
      }

      const { postData } = req.body;

      res.locals.dataBearer.user.password = undefined;

      postData.postedBy = res.locals.dataBearer.user;

      const newPost = await new Post(postData);

      await newPost.save();

      res.status(200).json({ message: "Post has been created", newPost });
      return next();
    } catch (err) {
      return next(err);
    }
  }

  public async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await Post.find({}).populate(
        "postedBy",
        "_id name email createdAt updatedAt "
      );

      if (!posts) {
        return Error("Unable to get all posts on PostMiddlewares.getAllPosts");
      }

      return res.json({ posts });
    } catch (err) {
      return next(err);
    }
  }

  public async getUserOwnPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!res.locals.dataBearer.user) {
        return Error(
          "Unable to get res.locals.dataBearer.user on PostMiddlewares.getUserOwnPosts"
        );
      }

      const { _id } = res.locals.dataBearer.user;

      const userOwnPosts = await Post.find({ postedBy: _id }).populate(
        "postedBy",
        "_id name email"
      );

      if (!userOwnPosts) {
        return Error("User own posts not found");
      }

      return res.json({ post: userOwnPosts });
    } catch (err) {
      return next(err);
    }
  }
}

const postMiddlewares = new PostMiddlewares();

export default postMiddlewares;
