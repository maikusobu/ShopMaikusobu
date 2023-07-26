import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const OrderDetails = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  totalPrice: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 },
  address_id: {
    type: Schema.Types.ObjectId,
    ref: "UserAddress",
  },
  OrderItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  payment_id: { type: Schema.Types.ObjectId, ref: "UserPayment" },
});
type OrderDetailsType = InferSchemaType<typeof OrderDetails>;
export default mongoose.model<OrderDetailsType>("OrderDetails", OrderDetails);
