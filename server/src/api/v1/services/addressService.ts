import user_addressModel from "../models/User_management/user_addressModel";
import { NotFound } from "../interfaces/ErrorInstances";

interface AddressData {
  user_id: string;
  province_code: string;
  district_code: string;
  ward_code: string;
  address_line_option: string;
}

export const createUserAddress = async (data: AddressData) => {
  const userAddress = new user_addressModel(data);
  await userAddress.save();
  return userAddress;
};

export const updateUserAddress = async (
  address_id: string,
  data: Partial<AddressData>
) => {
  if (!address_id) throw new NotFound(404, "address_id not found");
  const {
    user_id,
    province_code,
    district_code,
    ward_code,
    address_line_option,
  } = data;
  if (!user_id || !province_code || !district_code || !ward_code)
    throw new NotFound(404, "Missing some of requirements to create address");

  const userAddress = await user_addressModel.findByIdAndUpdate(
    address_id,
    {
      user_id,
      province_code,
      district_code,
      ward_code,
      address_line_option,
    },
    { new: true }
  );

  if (!userAddress) {
    throw new NotFound(404, "User address not found");
  }

  return userAddress;
};

export const deleteUserAddress = async (address_id: string) => {
  if (!address_id) throw new NotFound(404, "address_id not found");
  const userAddress = await user_addressModel.findByIdAndDelete(address_id);
  if (!userAddress) {
    throw new NotFound(404, "User address not found");
  }

  return userAddress;
};
