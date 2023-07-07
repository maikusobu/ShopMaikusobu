import mongoose from "mongoose";
import BaseSchema from "./BaseSchema";
const Schema = mongoose.Schema;

const ProductCategory = new Schema({
  name: [{ type: String, required: true }, "Lacking category"],
});
ProductCategory.add(BaseSchema);
export default mongoose.model("ProductCategory", ProductCategory);
