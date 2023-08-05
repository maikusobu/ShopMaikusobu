import { Request, Response, NextFunction } from "express";
import userModel from "../../models/User_management/userModel";
import asynchandle from "express-async-handler";
import { saveDataURLToBinaryData } from "../../helpers/savedataurl";
export const userMiddleware = asynchandle(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const avatar = "data:image/png;base64," + user.avatar.toString("base64");

      const userForfrondent = {
        idDefaultPayment: user.idDefaultPayment,
        idDefaultAddress: user.idDefaultAddress,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user._id,
        avatar: `${avatar}`,
        picture: user.picture,
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
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      if (req.body.avatar) {
        user.avatar = saveDataURLToBinaryData(req.body.avatar);
      }
      delete req.body.avatar;
      Object.assign(user, req.body);
      const updatedUser = await user.save();
      const dataURL =
        "data:image/png;base64," + updatedUser.avatar.toString("base64");
      res.status(200).json({
        username: updatedUser.username,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        idDefaultPayment: updatedUser.idDefaultPayment,
        idDefaultAddress: updatedUser.idDefaultAddress,
        id: updatedUser._id,
        avatar: `${dataURL}`,
      });
    } catch (error: any) {
      res.status(404).json({
        message: error.message,
        status: 404,
      });
    }
  }
);
