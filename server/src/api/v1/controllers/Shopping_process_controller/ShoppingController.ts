import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import shopping_session from "../../models/Shopping_process/shopping_session";
import cart_itemModel from "../../models/Shopping_process/cart_itemModel";
import { NotFound } from "../../interfaces/ErrorInstances";
export const getShoppingSession = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shopping_session
        .findOne({
          user_id: req.params.id,
        })
        .lean()
        .populate({
          path: "cart_items",
          populate: {
            path: "product_id",
            populate: [
              {
                path: "discount_id",
              },
              {
                path: "inventory_id",
              },
            ],
          },
        });

      if (!shopping_session_data) {
        throw new NotFound(404, "Shopping session not found");
      }
      res.status(200).json(shopping_session_data);
    } catch (error) {
      return next(error);
    }
  }
);
export const updateDelete = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { CartItemId } = req.body;

      const shopping_session_data = await shopping_session.findOneAndUpdate(
        { user_id: req.params.id },
        {
          $pull: {
            cart_items: CartItemId,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Item removed from cart",
        data: shopping_session_data,
      });
    } catch (error: any) {
      return next(error);
    }
  }
);

export const updateCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { CartItemId } = req.body;
      const shopping_session_data = await shopping_session.findOneAndUpdate(
        { user_id: req.params.id },
        {
          $addToSet: {
            cart_items: CartItemId,
          },
        },
        {
          new: true,
        }
      );
      res.status(200).json({
        message: "Item added to cart",
        data: shopping_session_data,
      });
    } catch (error: any) {
      return next(error);
    }
  }
);
export const deleteALlCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shopping_session
        .findOne({
          user_id: req.params.id,
        })
        .lean();
      const arrayHandleDelete = shopping_session_data?.cart_items.map(
        async (item) => await cart_itemModel.findByIdAndDelete(item)
      );
      await Promise.all(arrayHandleDelete as any);

      const shopping_session_data2 = await shopping_session.findOneAndUpdate(
        { user_id: req.params.id },
        {
          $set: {
            cart_items: [],
          },
        },
        { new: true }
      );
      res.status(200).json({
        message: "All Item removed from cart",
        data: shopping_session_data2,
      });
    } catch (err) {
      next(err);
    }
  }
);
