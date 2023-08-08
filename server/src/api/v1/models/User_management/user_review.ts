import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const UserReview = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  user_rating: {
    type: Schema.Types.ObjectId,
    ref: "UserRating",
  },
  reactionScore: {
    type: Number,
    require: true,
  },
});
export default mongoose.model<InferSchemaType<typeof UserReview>>(
  "UserReview",
  UserReview
);
