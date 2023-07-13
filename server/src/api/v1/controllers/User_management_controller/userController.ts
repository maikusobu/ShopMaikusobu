import { Request, Response, NextFunction } from "express";
import userModel from "../../models/User_management/userModel";
import asynchandle from "express-async-handler";
import { saveDataURLToFile } from "../../helpers/savedataurl";
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
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user._id,
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
export const userUpdateMiddleware = asynchandle(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.avatar) {
        saveDataURLToFile(req.body.avatar, req.body.username);
        console.log(req.body.avatar);
        delete req.body.avatar;
      }
      const user = await userModel.findByIdAndUpdate(req.params.id, req.body);
      if (!user) {
        throw new Error("User not found");
      }
      const imageData = fs.readFileSync(`${dirPath}/${user.username}.png`);
      const dataURL = "data:image/png;base64," + imageData.toString("base64");
      res.status(200).json({
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user._id,
        avatar: `${dataURL}`,
      });
    } catch (error: any) {
      console.log(error);
      res.status(404).json({
        message: error.message,
        status: 404,
      });
    }
  }
);
