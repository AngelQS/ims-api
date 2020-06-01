// Third
import { Request, Response, NextFunction } from "express";

class AuthControllers {
  public getProtected(req: Request, res: Response, next: NextFunction): void {
    new Promise(async (resolve, reject) => {
      res.json({ message: "Has entrado en la ruta protegida" });
    });
  }
}

const authControllers = new AuthControllers();

export default authControllers;
