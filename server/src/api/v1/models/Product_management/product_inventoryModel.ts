import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "./BaseSchema";
const Schema = mongoose.Schema;
const ProductInventory = new Schema({
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
});
type ProductInventoryType = InferSchemaType<typeof ProductInventory>;
ProductInventory.add(BaseSchema);
export default mongoose.model<ProductInventoryType>(
  "ProductInventory",
  ProductInventory
);
