import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const productRating = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating_value: {
    type: Number,
    require: true,
  },
  review: {
    type: String,
    require: true,
  },
});

export default mongoose.model<InferSchemaType<typeof productRating>>(
  "ProductRating",
  productRating
);
