import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import productModel from "../../models/Product_management/productModel";
import product_inventoryModel from "../../models/Product_management/product_inventoryModel";
import product_discountModel from "../../models/Product_management/product_discountModel";
type ProductInventoryType = {
  quantity?: number;
};
export const productGetAllMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query.page = req.query.page ? req.query.page : "1";

      const products = await productModel
        .find({})
        .populate({
          path: "inventory_id",
          model: product_inventoryModel,
          match: { quantity: { $gt: 0 } },
        })
        .populate({
          path: "discount_id",
          model: product_discountModel,
        })
        .skip(10 * (parseInt(req.query.page as string) - 1))
        .limit(10)
        .exec();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);

export const productGetByIdMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productModel.findById(req.params.id).exec();
      res.status(200).json(products);
    } catch (err) {
      return next(err);
    }
  }
);
export const productGetTrendingMiddleware = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productModel
        .find({})
        .populate({
          path: "inventory_id",
          model: product_inventoryModel,
          match: { quantity: { $gt: 0 } },
        })
        .populate({
          path: "discount_id",
          model: product_discountModel,
        })
        .sort({ amountPurchases: -1 })
        .limit(10)
        .exec();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
);
