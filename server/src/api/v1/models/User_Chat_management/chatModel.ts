import mongoose, { InferSchemaType } from "mongoose";
const chatSchema = new mongoose.Schema({
  participantsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastMessageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  unreadCount: { type: Number, default: 0 },
});
export default mongoose.model<InferSchemaType<typeof chatSchema>>(
  "Chat",
  chatSchema
);
