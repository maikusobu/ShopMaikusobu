import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const OrderDetails = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, default: 0 },
});
type OrderDetailsType = InferSchemaType<typeof OrderDetails>;
export default mongoose.model<OrderDetailsType>("OrderDetails", OrderDetails);
