/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cartService from "../../services/cartService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { MongoDBError } from "../../interfaces/ErrorInstances";

export const getCartItemByProductId = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cartItem = await cartService.getCartItemByProductId(
        req.params.product_id ? req.params.product_id : ""
      );
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
      const cartItem = await cartService.createCartItem(req.body);
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
      const cartItem = await cartService.updateCartItem(req.body);
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
      const cartItem = await cartService.deleteCartItem(req.body.product_id);
      res.status(200).json({
        message: "Cart item deleted successfully",
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  }
);
