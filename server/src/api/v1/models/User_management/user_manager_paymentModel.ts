import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;

const userPaymentManager = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  payment_list: [{ type: Schema.Types.ObjectId, ref: "UserPayment" }],
});
type userPaymentManagerType = InferSchemaType<typeof userPaymentManager>;
userPaymentManager.index({ user_id: 1 }, { unique: true });
export default mongoose.model<userPaymentManagerType>(
  "UserPaymentManager",
  userPaymentManager
);
