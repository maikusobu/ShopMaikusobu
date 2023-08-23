import * as paymentService from "../../services/paymentManagerService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
export const getUserPayments = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userPayment = await paymentService.getUserPayments(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(userPayment);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      res.status(404).json({ message: error.message, status: 404 });
    }
  }
);

export const updateDeletePayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await paymentService.updateDeletePayment(
        req.params.id ? req.params.id : "",
        req.body.payment_id
      );
      res.status(200).json({
        message: "payment has been removed",
        data: userPayment,
      });
    } catch (error) {
      return next(error);
    }
  }
);
export const updateInsertPayment = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayment = await paymentService.updateInsertPayment(
        req.params.id ? req.params.id : "",
        req.body.payment_id
      );
      res.status(200).json({
        message: "Payment added",
        data: userPayment,
      });
    } catch (error) {
      return next(error);
    }
  }
);
