import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;
const UserAddress = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  province_code: { type: String },
  district_code: { type: String },
  ward_code: { type: String },
  address_line_option: { type: String, default: "" },
});

export default mongoose.model<InferSchemaType<typeof UserAddress>>(
  "UserAddress",
  UserAddress
);
