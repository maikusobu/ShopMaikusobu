import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "../Product_management/BaseSchema";
const Schema = mongoose.Schema;
const CartItem = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be greater than 0"],
  },
});
CartItem.add(BaseSchema);
CartItem.index({ product_id: 1 }, { unique: true });
type CartItemType = InferSchemaType<typeof CartItem>;
export default mongoose.model<CartItemType>("CartItem", CartItem);
