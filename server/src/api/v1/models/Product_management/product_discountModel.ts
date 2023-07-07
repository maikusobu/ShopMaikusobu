import mongoose, { InferSchemaType } from "mongoose";
import BaseSchema from "./BaseSchema";
const Schema = mongoose.Schema;
const ProductDiscount = new Schema({
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
  discount_percent: {
    type: Number,
    required: [true, "Discount percent is required"],
    validate: {
      validator: function (v: number) {
        return v >= 0 && v <= 100;
      },
      message: "Discount percent should be between 0 and 100",
    },
  },
  active: { type: Boolean, default: false },
});
ProductDiscount.add(BaseSchema);
type ProductDiscountType = InferSchemaType<typeof ProductDiscount>;
export default mongoose.model<ProductDiscountType>(
  "ProductDiscount",
  ProductDiscount
);
