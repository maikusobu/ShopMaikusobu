import mongoose, { SchemaType } from "mongoose";
const Schema = mongoose.Schema;
const ConfirmNumber = new Schema({
  numberConfirm: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600,
  },
});
export default mongoose.model("ConfirmNumber", ConfirmNumber);
