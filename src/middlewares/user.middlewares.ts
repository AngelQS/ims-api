// Third
import { Request, Response, NextFunction } from "express";

// Local
import User from "../models/User";
import Post from "../models/Post";

class UserMiddlewares {
  public async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id: userId } = req.params;

      const user = await User.findOne({ _id: userId }).select("-password");

      if (!user) {
        return Error("User not found");
      }

      const posts = await Post.find({ postedBy: userId }).populate(
        "postedBy",
        "_id name"
      );

      return res.json({ user, posts });
    } catch (err) {
      console.log("Error:", err);
    }
  }
}

const userMiddlewares = new UserMiddlewares();

export default userMiddlewares;
