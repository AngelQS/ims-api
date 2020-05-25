import { Request, Response, NextFunction } from "express";
import adaptRequest from "../utils/adapt-request";
import { Error } from "mongoose";

export default class AuthMiddlewares {
  static getRequest(req: Request, res: Response, next: NextFunction) {
    new Promise(async (resolve, reject) => {
      // Handling error if request does not exist
      if (!req) {
        return reject(
          new Error("Unable to get request on AuthMiddlewares.getRequest")
        );
      }

      // Getting request
      const adaptedRequest = adaptRequest(req);

      return resolve(adaptedRequest);
    })
      .then((adaptedRequest): any => {
        res.locals.HTTPRequest = adaptedRequest;
        return next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
