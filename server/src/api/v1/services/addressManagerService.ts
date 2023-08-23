import user_addressManagerModel from "../models/User_management/user_addressManagerModel";
import user_addressModel from "../models/User_management/user_addressModel";
import { NotFound } from "../interfaces/ErrorInstances";

export const getUserAddresses = async (id: string) => {
  const userAddress = await user_addressManagerModel
    .findOne({
      user_id: id,
    })
    .populate({
      path: "address_list",
      model: user_addressModel,
    });
  if (!userAddress) throw new NotFound(404, "user's address not found");
  return userAddress;
};

export const updateDeleteAddress = async (id: string, address_id: string) => {
  if (!address_id) throw new NotFound(404, "address_id not found");
  const userAddress = await user_addressManagerModel
    .findOneAndUpdate(
      { user_id: id },
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
  return userAddress;
};

export const updateInsertAddress = async (id: string, address_id: string) => {
  if (!address_id) throw new NotFound(404, "address_id not found");
  return await user_addressManagerModel
    .findOneAndUpdate(
      { user_id: id },
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
};
