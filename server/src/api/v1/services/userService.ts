import userModel from "../models/User_management/userModel";
import { saveDataURLToBinaryData } from "../helpers/savedataurl";
import { NotFound } from "../interfaces/ErrorInstances";
import type { User } from "../../../types/httpResponseType";
export const getUserById = async (id: string): Promise<User> => {
  const user = await userModel.findById(id);
  if (!user) {
    throw new NotFound(404, "User not found");
  }
  const avatar = "data:image/png;base64," + user.avatar.toString("base64");
  return {
    idDefaultPayment: user.idDefaultPayment.toString(),
    idDefaultAddress: user.idDefaultAddress.toString(),
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    id: user.id,
    avatar,
    picture: user.picture,
  };
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const user = await userModel.findById(id);
  if (!user) {
    throw new NotFound(404, "User not found");
  }
  if (data.avatar) {
    user.avatar = saveDataURLToBinaryData(data.avatar);
    delete data.avatar;
  }
  Object.assign(user, data);
  const updatedUser = await user.save();
  const dataURL =
    "data:image/png;base64," + updatedUser.avatar.toString("base64");
  return {
    username: updatedUser.username,
    first_name: updatedUser.first_name,
    last_name: updatedUser.last_name,
    idDefaultPayment: updatedUser.idDefaultPayment.toString(),
    idDefaultAddress: updatedUser.idDefaultAddress.toString(),
    id: updatedUser.id,
    avatar: dataURL,
    picture: updatedUser.picture,
  };
};
