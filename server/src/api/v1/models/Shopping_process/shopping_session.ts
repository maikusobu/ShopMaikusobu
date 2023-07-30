import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;

const ShoppingSession = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  cart_items: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
});
type ShoppingSessionType = InferSchemaType<typeof ShoppingSession>;
ShoppingSession.index({ user_id: 1 }, { unique: true });
export default mongoose.model<ShoppingSessionType>(
  "ShoppingSession",
  ShoppingSession
);
