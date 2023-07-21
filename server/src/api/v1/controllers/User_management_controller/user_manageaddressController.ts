import expressAsyncHandler from "express-async-handler";
import { Request, NextFunction, Response } from "express";
import user_addressManagerModel from "../../models/User_management/user_addressManagerModel";
import user_addressModel from "../../models/User_management/user_addressModel";
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
      res.status(200).json(userAddress);
    } catch (error: any) {
      res.status(404).json({ message: error.message, status: 404 });
    }
  }
);
export const updateDeleteAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.body;
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
      console.log(error);
      return next(error);
    }
  }
);

export const updateInsertAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address_id } = req.body;
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
      console.log(error);
      return next(error);
    }
  }
);
