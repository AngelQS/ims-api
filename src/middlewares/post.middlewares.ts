// Third
import { Request, Response, NextFunction } from "express";

// Local
import Post from "../models/Post";
import trimData from "../utils/trim-data";

export default class PostMiddlewares {
  static createPost(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.HTTPRequest.body is null
      if (!res.locals.HTTPRequest.body) {
        return reject(
          new Error(
            "Unable to get res.locals.HTTPRequest.body on UserMiddlewares.signUpDataValidation"
          )
        );
      }

      // Getting request body
      const { title, body } = res.locals.HTTPRequest.body;

      if (!title || !body) {
        return reject(Error("There are missing fields"));
      }
      console.log("title and body:", title, body);
      // Clean and validate user data
      const cleanData = trimData({ title, body });

      res.locals.userSession.password = undefined;

      const newPost = await new Post({
        title: cleanData.title,
        body: cleanData.body,
        postedBy: res.locals.userSession,
      });

      await newPost.save();

      return resolve(newPost);
    })
      .then((post) => {
        console.log("res.locals.user:", res.locals.userSession);
        return res.status(200).json({ message: "Post has been created", post });
      })
      .catch((err) => {
        return next(err);
      });
  }

  static getAllPosts(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      const posts = await Post.find({}).populate(
        "postedBy",
        "_id name email createdAt updatedAt "
      );

      if (!posts) {
        return reject(
          Error("Unable to get all posts on PostMiddlewares.getAllPosts")
        );
      }

      return resolve(posts);
    })
      .then((posts) => {
        return res.json({ posts });
      })
      .catch((err) => {
        return next(err);
      });
  }

  static getUserOwnPosts(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if res.locals.userSession is null
      if (!res.locals.userSession) {
        return reject(
          Error(
            "Unable to get res.locals.userSession on PostMiddlewares.getUserOwnPosts"
          )
        );
      }

      // Getting request body
      const { _id } = res.locals.userSession;

      const userOwnPosts = await Post.find({ postedBy: _id }).populate(
        "postedBy",
        "_id, name email"
      );

      if (!userOwnPosts) {
        return reject(Error("User own posts not found"));
      }

      return resolve(userOwnPosts);
    })
      .then((posts) => {
        return res.json({ posts });
      })
      .catch((err) => {
        return next(err);
      });
  }
}
