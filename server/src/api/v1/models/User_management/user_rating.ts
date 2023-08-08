import mongoose, { InferSchemaType } from "mongoose";
const userRating = new mongoose.Schema({
  rating_value: {
    type: Number,
    require: true,
  },
  review: {
    type: String,
    require: true,
  },
});
export default mongoose.model<InferSchemaType<typeof userRating>>(
  "UserRating",
  userRating
);
