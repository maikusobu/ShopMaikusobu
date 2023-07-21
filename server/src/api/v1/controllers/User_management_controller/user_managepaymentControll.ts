import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_manager_paymentModel from "../../models/User_management/user_manager_paymentModel";
import user_paymentModel from "../../models/User_management/user_paymentModel";
export const getUserPayments = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await user_manager_paymentModel
        .findOne({
          user_id: req.params.id,
        })
        .populate({
          path: "payment_list",
          model: user_paymentModel,
        });
      res.status(200).json(userPayment);
    } catch (error: any) {
      res.status(404).json({ message: error.message, status: 404 });
    }
  }
);
export const updateDeletePayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payment_id } = req.body;
      const userPayment = await user_manager_paymentModel
        .findOneAndUpdate(
          { user_id: req.params.id },
          {
            $pull: {
              payment_list: payment_id,
            },
          },
          {
            new: true,
          }
        )
        .populate({
          path: "payment_list",
          model: user_paymentModel,
        });
      await user_paymentModel.findByIdAndDelete(payment_id);
      res.status(200).json({
        message: "payment has been removed",
        data: userPayment,
      });
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }
);

export const updateInsertPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { payment_id } = req.body;
      const userPayment = await user_manager_paymentModel
        .findOneAndUpdate(
          { user_id: req.params.id },
          {
            $addToSet: {
              payment_list: payment_id,
            },
          },
          {
            new: true,
          }
        )
        .populate({
          path: "payment_list",
          model: user_paymentModel,
        });
      res.status(200).json({
        message: "Payment added",
        data: userPayment,
      });
    } catch (error: any) {
      console.log(error);
      return next(error);
    }
  }
);
