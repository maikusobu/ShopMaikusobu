import mongoose, { ValidatorProps } from "mongoose";
import type { UserAddressModel } from "../../../../types/modelTypes/User_management_types/UserAddressModeTypes";
const Schema = mongoose.Schema;
const UserAddress = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  address_line1: { type: String, required: true },
  address_line2: { type: String },
  city: { type: String, required: true },
  country: { type: String, default: "VN" },
});

export default mongoose.model<UserAddressModel>("UserAddress", UserAddress);
