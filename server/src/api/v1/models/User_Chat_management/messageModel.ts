import mongoose, { InferSchemaType } from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); // message sẽ bị xóa sau 7 ngày để giảm tải server
export default mongoose.model<InferSchemaType<typeof MessageSchema>>(
  "Message",
  MessageSchema
);
