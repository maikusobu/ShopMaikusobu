import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_addressManagerModel from "../../models/User_management/user_addressManagerModel";
import user_addressModel from "../../models/User_management/user_addressModel";
import { NotFound } from "../../interfaces/ErrorInstances";
export const getUserAddresses = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userAddress = await user_addressManagerModel
        .findOne({
          user_id: req.params.id,
        })
        .populate({
          path: "address_list",
          model: user_addressModel,
        });
      if (!userAddress) throw new NotFound(404, "user's address not found");
      res.status(200).json(userAddress);
    } catch (error) {
      return next(error);
    }
  }
);
export const updateDeleteAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.body;
      if (!address_id) throw new NotFound(404, "address_id not found");
      const userAddress = await user_addressManagerModel
        .findOneAndUpdate(
          { user_id: req.params.id },
          {
            $pull: {
              address_list: address_id,
            },
          },
          {
            new: true,
          }
        )
        .populate({
          path: "address_list",
          model: user_addressModel,
        });
      await user_addressModel.findByIdAndDelete(address_id);
      res.status(200).json({
        message: "Address has been removed",
        data: userAddress,
      });
    } catch (error: any) {
      return next(error);
    }
  }
);

export const updateInsertAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.body;
      if (!address_id) throw new NotFound(404, "address_id not found");
      const userAddress = await user_addressManagerModel
        .findOneAndUpdate(
          { user_id: req.params.id },
          {
            $addToSet: {
              address_list: address_id,
            },
          },
          {
            new: true,
          }
        )
        .populate({
          path: "address_list",
          model: user_addressModel,
        });
      res.status(200).json({
        message: "Address added",
        data: userAddress,
      });
    } catch (error: any) {
      return next(error);
    }
  }
);
