import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "../Product_management/BaseSchema";
const Schema = mongoose.Schema;

const OrderItem = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be greater than 0"],
  },
});
OrderItem.add(BaseSchema);
type OrderItemType = InferSchemaType<typeof OrderItem>;
export default mongoose.model<OrderItemType>("OrderItem", OrderItem);
