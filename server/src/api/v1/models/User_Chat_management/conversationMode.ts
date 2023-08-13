import mongoose, { InferSchemaType } from "mongoose";
const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        participant_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        hasNewMessage: Boolean,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model<InferSchemaType<typeof ConversationSchema>>(
  "Conversation",
  ConversationSchema
);
