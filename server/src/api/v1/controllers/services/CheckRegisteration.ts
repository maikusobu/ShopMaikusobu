import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import user_confirm_number from "../../models/User_management/user_confirm_number";
import userModel from "../../models/User_management/userModel";
export const CheckRegisteration = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, numberConfirm } = req.body;
      const numberConfirmUser = await user_confirm_number.findOne({
        user_id: user_id,
      });
      if (!numberConfirmUser) throw new Error("Cannot found number");
      else if (numberConfirmUser.numberConfirm === numberConfirm) {
        const user = await userModel.findById(user_id);
        if (!user) throw new Error("Cannot found user");
        user.isVerified = true;
        await user.save();
        await user_confirm_number.findByIdAndDelete(numberConfirmUser._id);

        res.status(200).json({ message: "Confirm success" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);
