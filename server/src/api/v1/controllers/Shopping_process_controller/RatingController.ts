import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import product_ratingModel from "../../models/Product_management/product_ratingModel";
export const Ratingupdate = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, rating_value } = req.body;
      const ratingProduct = await product_ratingModel.findOne({
        user_id: user_id,
      });
      if (ratingProduct) {
        await product_ratingModel.updateOne(
          { user_id: user_id },
          { $set: { rating_value: rating_value } }
        );
      }
    } catch (err) {
      next(err);
    }
  }
);
