import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import cart_itemModel from "../../models/Shopping_process/cart_itemModel";
import { NotFound, MongoDBError } from "../../interfaces/ErrorInstances";
export const getCartItemByProductId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id } = req.params;
      const cartItem = await cart_itemModel.findOne({ product_id }).lean();
      if (!cartItem) {
        throw new NotFound(404, "Cart item not found");
      }
      res.status(200).json({
        message: "Cart item fetched successfully",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }
);
export const createCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id, quantity } = req.body;
      let cartItem;
      const cartItemFound = await cart_itemModel.findOne({ product_id }).lean();
      if (cartItemFound) {
        cartItem = await cart_itemModel.findOneAndUpdate(
          { product_id: product_id },
          { quantity: quantity + cartItemFound.quantity },
          {
            new: true,
          }
        );
      } else cartItem = await cart_itemModel.create({ product_id, quantity });
      res.status(201).json({
        message: "Cart item created successfully",
        data: cartItem,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(
          (error: any) => error.message
        );
        return next(new MongoDBError(400, errors));
      }
      next(error);
    }
  }
);
export const updateCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id, quantity } = req.body;
      const cartItem = await cart_itemModel.findOneAndUpdate(
        { product_id },
        { quantity },
        { new: true, runValidators: true }
      );
      if (!cartItem) {
        throw new NotFound(404, "Cart item not found");
      }
      res.status(200).json({
        message: "Cart item updated successfully",
        data: cartItem,
      });
    } catch (error) {
      return next(error);
    }
  }
);
export const deleteCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { product_id } = req.body;
      const cartItem = await cart_itemModel.findOneAndDelete({ product_id });
      if (!cartItem) {
        throw new NotFound(404, "Cart item not found");
      }
      res.status(200).json({
        message: "Cart item deleted successfully",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }
);
