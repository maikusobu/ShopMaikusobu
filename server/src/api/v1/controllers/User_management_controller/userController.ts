import * as userService from "../../services/userService";
import asynchandle from "express-async-handler";
import { Request, Response, NextFunction } from "express";
export const userMiddleware = asynchandle(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUserById(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }
);
export const userUpdateMiddleware = asynchandle(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await userService.updateUser(
        req.params.id ? req.params.id : "",
        req.body
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      return next(error);
    }
  }
);
