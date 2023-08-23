/* eslint-disable @typescript-eslint/no-explicit-any */
import * as addressService from "../../services/addressService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { MongoDBError } from "../../interfaces/ErrorInstances";

export const createUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.createUserAddress(req.body);
      res.status(201).json({
        message: "User address created successfully",
        data: userAddress,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        next(new MongoDBError(400, errors));
      } else next(error);
    }
  }
);

export const updateUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.updateUserAddress(
        req.params.address_id ? req.params.address_id : "",
        req.body
      );
      res.status(200).json({
        message: "User address updated successfully",
        data: userAddress,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const deleteUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.deleteUserAddress(
        req.params.address_id ? req.params.address_id : ""
      );
      res.status(200).json({
        message: "User address deleted successfully",
        data: userAddress,
      });
    } catch (error) {
      next(error);
    }
  }
);
