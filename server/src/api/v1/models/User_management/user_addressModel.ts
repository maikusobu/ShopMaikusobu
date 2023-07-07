import mongoose, { ValidatorProps } from "mongoose";
import type { UserAddressModel } from "../../../../types/modelTypes/User_management_types/UserAddressModeTypes";
const Schema = mongoose.Schema;
const UserAddress = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  address_line1: { type: String, required: true },
  address_line2: { type: String },
  city: { type: String, required: true },
  postal_code: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^\d{5}(-\d{4})?$/.test(v);
      },
      message: (props: ValidatorProps) =>
        `${props.value} is not a valid US ZIP code.`,
    },
  },
  country: { type: String, default: "VN" },
});

export default mongoose.model<UserAddressModel>("UserAddress", UserAddress);
