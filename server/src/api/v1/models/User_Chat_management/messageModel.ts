import mongoose, { InferSchemaType } from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: String,
  },
  {
    timestamps: true,
  }
);
MessageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
export type Message = InferSchemaType<typeof MessageSchema>;
// message sẽ bị xóa sau 7 ngày để giảm tải server
export default mongoose.model<Message>("Message", MessageSchema);
