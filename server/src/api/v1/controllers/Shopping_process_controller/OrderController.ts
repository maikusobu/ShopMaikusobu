import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import order_detailsModel from "../../models/Shopping_process/order_detailsModel";
export const OrderCreate = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDetails = new order_detailsModel(req.body);
    } catch (err) {
      next(err);
    }
  }
);
