import * as shoppingService from "../../services/shoppingService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const getShoppingSession = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shoppingService.getShoppingSession(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(shopping_session_data);
    } catch (error) {
      return next(error);
    }
  }
);

export const updateDelete = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shoppingService.updateDelete(
        req.params.id ? req.params.id : "",
        req.body.CartItemId
      );
      res.status(200).json({
        message: "Item removed from cart",
        data: shopping_session_data,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const updateCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data = await shoppingService.updateCartItem(
        req.params.id ? req.params.id : "",
        req.body.CartItemId
      );
      res.status(200).json({
        message: "Item added to cart",
        data: shopping_session_data,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const deleteALlCartItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shopping_session_data2 = await shoppingService.deleteALlCartItem(
        req.params.id ? req.params.id : ""
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
