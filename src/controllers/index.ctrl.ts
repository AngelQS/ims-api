// Third
import { Request, Response, NextFunction } from "express";

export default class IndexController {
  static getIndex(req: Request, res: Response): void {
    res.json("Api: /api/index");
  }
}
