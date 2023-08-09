import mongoose, { InferSchemaType } from "mongoose";
const userReactionScore = new mongoose.Schema({
  upvote: [
    {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
    },
  ],
  downvote: [
    {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
    },
  ],
});
userReactionScore.index({ upvote: 1, downvote: 1 }, { unique: true });
export default mongoose.model<InferSchemaType<typeof userReactionScore>>(
  "UserReaction",
  userReactionScore
);
