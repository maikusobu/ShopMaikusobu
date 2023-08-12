import mongoose, { InferSchemaType } from "mongoose";
const sessionSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: String,
  connected: Boolean,
});
export type Session = InferSchemaType<typeof sessionSchema>;
export default mongoose.model<Session>("session", sessionSchema);
