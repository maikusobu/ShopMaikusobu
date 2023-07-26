import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import order_items from "../../models/Shopping_process/order_items";
import order_detailsModel from "../../models/Shopping_process/order_detailsModel";
export const OrderCreate = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const arrayhandleOrderitem = req.body.OrderItems.map(
        async (OrderItem: any) => await order_items.create(OrderItem)
      );
      const OrderItems = await Promise.all(arrayhandleOrderitem);
      const orderDetails = await order_detailsModel.create({
        user_id: req.body.user_id,
        totalPrice: req.body.totalPrice,
        totalQuantity: req.body.totalQuantity,
        address_id: req.body.address_id,
        OrderItems: OrderItems,
        payment_id: req.body.payment_id,
      });
      res.status(200).json(orderDetails);
    } catch (err) {
      next(err);
    }
  }
);
export const OrderList = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDetails = await order_detailsModel.find({
        user_id: req.params.user_id,
      });
      res.status(200).json(orderDetails);
    } catch (err) {
      next(err);
    }
  }
);
export const OrderDelete = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderDelete = await order_detailsModel.findByIdAndDelete(
        req.params.id
      );
      res.status(200).json(orderDelete);
    } catch (err) {
      next(err);
    }
  }
);
