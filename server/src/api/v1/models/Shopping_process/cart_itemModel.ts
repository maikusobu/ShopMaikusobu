import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "../Product_management/BaseSchema";
const Schema = mongoose.Schema;
const CartItem = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  session_id: { type: Schema.Types.ObjectId, ref: "Session" },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity must be greater than 0"],
  },
});
CartItem.add(BaseSchema);
type CartItemType = InferSchemaType<typeof CartItem>;
export default mongoose.model<CartItemType>("CartItem", CartItem);
