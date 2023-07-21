import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const userAddressManager = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  address_list: [{ type: Schema.Types.ObjectId, ref: "UserAddress" }],
});
type userAddressManagerType = InferSchemaType<typeof userAddressManager>;
export default mongoose.model<userAddressManagerType>(
  "UserAddressManager",
  userAddressManager
);
