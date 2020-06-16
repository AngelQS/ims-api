// Third
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// Local
import Post from "../models/Post";
import PostValidator from "../services/validators/post-validator";

// Initializations
const { getErrorFormater: postErrorFormater } = PostValidator;

class PostMiddlewares {
  public async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
        .formatWith(postErrorFormater())
        .array({ onlyFirstError: true });

      if (errors.length > 0) {
        console.log("ERRORS:", errors[0]);
        return Error("Validation Errors");
      }

      if (!res.locals.bearer.user) {
        return Error(
          "Unable to get res.locals.bearer.user on PostMiddlewares.createPost"
        );
      }

      const postData = req.body;

      res.locals.bearer.user.password = undefined;

      postData.postedBy = res.locals.bearer.user;

      const newPost = new Post(postData);

      await newPost.save();

      res.status(200).json({ message: "Post has been created", newPost });
      return next();
    } catch (err) {
      return next(err);
    }
  }

  public async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await Post.find({})
        .populate("postedBy", "_id name email createdAt updatedAt ")
        .populate("comments.postedBy", "_id username");

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
      if (!res.locals.bearer.user) {
        return Error(
          "Unable to get res.locals.bearer.user on PostMiddlewares.getUserOwnPosts"
        );
      }

      const { _id } = res.locals.bearer.user;

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

  public async likeToAPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: userId } = res.locals.bearer.user;

      const { _id: postId } = req.body;

      const post = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );

      if (!post) {
        return Error("Post not found to set a like");
      }

      return (
        res
          //.status(422)
          .json({ message: "Success assign like to a post", post })
      );
    } catch (err) {
      console.log("Error on unlike:", err);
    }
  }

  public async unlikeToAPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: userId } = res.locals.bearer.user;

      const { _id: postId } = req.body;

      const post = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );

      if (!post) {
        return Error("Post not found to unlike the post");
      }

      return (
        res
          //.status(422)
          .json({ message: "Success assign unlike to a post", post })
      );
    } catch (err) {
      console.log("Error on unlike:", err);
    }
  }

  public async commentAPost(req: Request, res: Response, next: NextFunction) {
    try {
      const newComment = {
        text: req.body.text,
        postedBy: res.locals.bearer.user._id,
      };

      const { _id: postId } = req.body;

      const post = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: newComment } },
        { new: true }
      )
        .populate("comments.postedBy", "_id username")
        .populate("postedBy", "_id username");

      if (!post) {
        return Error("Post not found to set a like");
      }

      return res.json({ message: "Success assign like to a post", post });
    } catch (err) {
      console.log("Error:", err);
    }
  }
}

const postMiddlewares = new PostMiddlewares();

export default postMiddlewares;
