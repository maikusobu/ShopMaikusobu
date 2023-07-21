import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_paymentModel from "../../models/User_management/user_paymentModel";
export const createUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, payment_type, card_number, expire } = req.body;
      const expireDate = new Date(expire);
      const userPayment = new user_paymentModel({
        user_id: user_id,
        payment_type: payment_type,
        card_number: card_number,
        expire: expireDate,
      });
      await userPayment.save();
      res.status(200).json({
        message: "User payment created successfully",
        data: userPayment,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export const updateUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payment_id } = req.params;
      const { user_id, payment_type, card_number, expire } = req.body;
      const expireDate = new Date(expire);
      const userPayment = await user_paymentModel.findByIdAndUpdate(
        payment_id,
        {
          user_id: user_id,
          payment_type: payment_type,
          card_number: card_number,
          expire: expireDate,
        },
        { new: true }
      );

      if (!userPayment) {
        throw new Error("User payment not found");
      }

      res.status(200).json({
        message: "User payment updated successfully",
        data: userPayment,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const deleteUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payment_id } = req.params;
      const userPayment = await user_paymentModel.findByIdAndDelete(payment_id);

      if (!userPayment) {
        throw new Error("User payment not found");
      }

      res.status(200).json({
        message: "User payment deleted successfully",
        data: userPayment,
      });
    } catch (error) {
      next(error);
    }
  }
);
