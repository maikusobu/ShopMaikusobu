import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;

const PaymentDetails = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: "OrderDetails" },
  payment_method: { type: String, required: true },
  payment_status: { type: String, required: true },
});
type PaymentDetailsType = InferSchemaType<typeof PaymentDetails>;
export default mongoose.model<PaymentDetailsType>(
  "PaymentDetails",
  PaymentDetails
);
