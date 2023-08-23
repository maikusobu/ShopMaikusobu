import * as addressService from "../../services/addressManagerService";
import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";

export const getUserAddresses = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.getUserAddresses(
        req.params.id ? req.params.id : ""
      );
      res.status(200).json(userAddress);
    } catch (error) {
      return next(error);
    }
  }
);

export const updateDeleteAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.updateDeleteAddress(
        req.params.id ? req.params.id : "",
        req.body.address_id
      );
      res.status(200).json({
        message: "Address has been removed",
        data: userAddress,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export const updateInsertAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await addressService.updateInsertAddress(
        req.params.id ? req.params.id : "",
        req.body.address_id
      );
      res.status(200).json({
        message: "Address added",
        data: userAddress,
      });
    } catch (error) {
      return next(error);
    }
  }
);
