import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "./BaseSchema";

const Schema = mongoose.Schema;
const Product = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    validate: {
      validator: function (v: string) {
        return v.trim().length > 0;
      },
      message: "Name cannot be empty",
    },
  },
  desc: {
    type: String,
    required: [true, "Description is required"],
    validate: {
      validator: function (v: string) {
        return v.trim().length > 10;
      },
      message: "Description should be at least 10 characters long",
    },
  },
  SKU: {
    type: String,
    required: [true, "SKU is required"],
    validate: {
      validator: function (v: string) {
        return /^[A-Z0-9]+$/.test(v);
      },
      message: "SKU should only contain uppercase letters and numbers",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function (v: number) {
        return v > 0;
      },
      message: "Price should be a positive number",
    },
  },
  category_id: { type: Schema.Types.ObjectId, ref: "ProductCategory" },
  discount_id: { type: Schema.Types.ObjectId, ref: "ProductDiscount" },
  inventory_id: {
    type: Schema.Types.ObjectId,
    ref: "ProductInventory",
    required: true,
  },
  image: [{ type: String, default: "" }],
  amountPurchased: { type: Number, default: 0 },
});

type ProductType = InferSchemaType<typeof Product>;
Product.add(BaseSchema);
Product.virtual("id").get(function () {
  return this._id.toHexString();
});

export default mongoose.model<ProductType>("Product", Product);
