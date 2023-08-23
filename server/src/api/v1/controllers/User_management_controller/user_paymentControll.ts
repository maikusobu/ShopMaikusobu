import * as paymentService from "../../services/paymentService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const createUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await paymentService.createUserPayment(req.body);
      res.status(201).json({
        message: "User payment created successfully",
        data: userPayment,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const updateUserPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await paymentService.updateUserPayment(
        req.params.payment_id ? req.params.payment_id : "",
        req.body
      );
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
      const userPayment = await paymentService.deleteUserPayment(
        req.params.payment_id ? req.params.payment_id : ""
      );
      res.status(200).json({
        message: "User payment deleted successfully",
        data: userPayment,
      });
    } catch (error) {
      next(error);
    }
  }
);
