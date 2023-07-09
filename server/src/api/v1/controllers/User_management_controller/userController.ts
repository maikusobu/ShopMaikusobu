import { Request, Response, NextFunction } from "express";
import userModel from "../../models/User_management/userModel";
import asynchandle from "express-async-handler";
import * as fs from "fs";
import { dirPath } from "../../helpers/returnUrl";
export const userMiddleware = asynchandle(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const imageData = fs.readFileSync(`${dirPath}/${user.username}.png`);
      const dataURL = "data:image/png;base64," + imageData.toString("base64");
      const userForfrondent = {
        avatar: `${dataURL}`,
      };
      res.status(200).json(userForfrondent);
    } catch (error: any) {
      res.status(404).json({
        message: error.message,
        status: 404,
      });
    }
  }
);
