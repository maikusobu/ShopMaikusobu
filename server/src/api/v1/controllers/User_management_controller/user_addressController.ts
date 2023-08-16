import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_addressModel from "../../models/User_management/user_addressModel";
import { NotFound, MongoDBError } from "../../interfaces/ErrorInstances";
export const createUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = new user_addressModel(req.body);
      await userAddress.save();
      res.status(201).json({
        message: "User address created successfully",
        data: userAddress,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(
          (error: any) => error.message
        );
        next(new MongoDBError(400, errors));
      } else next(error);
    }
  }
);

export const updateUserAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.params;
      if (!address_id) throw new NotFound(404, "address_id not found");
      const {
        user_id,
        province_code,
        district_code,
        ward_code,
        address_line_option,
      } = req.body;
      if (!user_id || !province_code || !district_code || !ward_code)
        throw new NotFound(
          404,
          "Missing some of requirements to create address"
        );

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
        throw new NotFound(404, "User address not found");
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
      if (!address_id) throw new NotFound(404, "address_id not found");
      const userAddress = await user_addressModel.findByIdAndDelete(address_id);
      if (!userAddress) {
        throw new NotFound(404, "User address not found");
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
