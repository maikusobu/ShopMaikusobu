import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_paymentModel from "../../models/User_management/user_paymentModel";
export const getUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await user_paymentModel.find({
        user_id: req.params.id,
      });
      if (userPayment.length < 1) {
        throw new Error("User Payment not found");
      }
      console.log(userPayment);
      res.status(200).json(userPayment);
    } catch (error: any) {
      res.status(404).json({ message: error.message, status: 404 });
    }
  }
);
export const upsertUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const existingPayment = await user_paymentModel.findOne({
        userId: req.body.userId,
      });
      if (existingPayment) {
        req.body.expire = new Date(req.body.expire);
        const updatedPayment = await user_paymentModel.findByIdAndUpdate(
          existingPayment._id,
          req.body,
          { new: true }
        );
        res.status(200).json(updatedPayment);
      } else {
        // Create new payment
        const newPayment = await user_paymentModel.create(req.body);
        res.status(200).json(newPayment);
      }
    } catch (error: any) {
      if (error.name === "ValidationError") {
        res
          .status(400)
          .json({ message: error.message, status: 400, type: "validation" });
      }
      res.status(500).json({ message: error.message, status: 500 });
    }
  }
);
