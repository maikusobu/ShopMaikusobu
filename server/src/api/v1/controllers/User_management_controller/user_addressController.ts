import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_addressModel from "../../models/User_management/user_addressModel";

export const createUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const userAddress = new user_addressModel(req.body);
      await userAddress.save();

      res.status(201).json({
        message: "User address created successfully",
        data: userAddress,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const updateUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.params;
      const {
        user_id,
        province_code,
        district_code,
        ward_code,
        address_line_option,
      } = req.body;
      const userAddress = await user_addressModel.findByIdAndUpdate(
        address_id,
        {
          user_id: user_id,
          province_code: province_code,
          district_code: district_code,
          ward_code: ward_code,
          address_line_option: address_line_option,
        },
        { new: true }
      );

      if (!userAddress) {
        throw new Error("User address not found");
      }

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
      const { address_id } = req.params;
      const userAddress = await user_addressModel.findByIdAndDelete(address_id);

      if (!userAddress) {
        throw new Error("User address not found");
      }

      res.status(200).json({
        message: "User address deleted successfully",
        data: userAddress,
      });
    } catch (error) {
      next(error);
    }
  }
);
