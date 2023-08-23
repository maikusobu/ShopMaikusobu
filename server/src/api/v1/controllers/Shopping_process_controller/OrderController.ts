import * as orderService from "../../services/orderService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const OrderCreate = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDetails = await orderService.OrderCreate(req.body);
      res.status(201).json(orderDetails);
    } catch (err) {
      next(err);
    }
  }
);

export const OrderList = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDetails = await orderService.OrderList(
        req.params.user_id ? req.params.user_id : ""
      );
      res.status(200).json(orderDetails);
    } catch (err) {
      next(err);
    }
  }
);

export const OrderDelete = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDelete = await orderService.OrderDelete(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(orderDelete);
    } catch (err) {
      next(err);
    }
  }
);
