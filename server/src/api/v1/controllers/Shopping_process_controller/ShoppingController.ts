import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import shopping_session from "../../models/Shopping_process/shopping_session";
export const getShoppingSession = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shopping_session
        .findOne({
          user_id: req.params.id,
        })
        .populate({
          path: "cart_items",
          populate: {
            path: "product_id",
          },
        });
      shopping_session_data?.cart_items;
      if (!shopping_session_data) {
        throw new Error("Shopping session not found");
      }
      res.status(200).json(shopping_session_data);
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
        status: 400,
      });
    }
  }
);
export const updateShoppingSession = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { CartItemId } = req.body;

    try {
      shopping_session.findOne(
        { user_id: req.params.id },
        (err: any, data: any) => {
          if (err) {
            throw new Error(err.message);
          }
          if (data) {
            shopping_session.updateOne(
              {
                $pull: {
                  cart_items: {
                    _id: CartItemId,
                  },
                },
              },
              function (error: any, result: any) {
                if (error) {
                  throw new Error(error.message);
                }
                if (result) {
                  res.status(200).json({
                    message: "Item removed from cart",
                    data: result,
                  });
                }
              }
            );
          }
        }
      );
    } catch (error: any) {
      next(error);
    }
  }
);
export const updateCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { CartItemId } = req.body;
      const shopping_session_data = await shopping_session.findOneAndUpdate(
        { user_id: req.params.id},
        {
          $addToSet: {
            cart_items: {
              _id: CartItemId,
            },
          },
        }
      );
      res.status(200).json({
        message: "Item added to cart",
        data: shopping_session_data,
      });
    } catch (error: any) {
      next(error);
    }
  }
);
