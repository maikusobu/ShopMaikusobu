import mongoose, { InferSchemaType } from "mongoose";
const Schema = mongoose.Schema;
const AdminMode = new Schema(
  {
    username: { type: String, require: true },
    password: { type: String, require: true },
    first_name: { type: String, default: "Admin" },
    last_name: { type: String, default: "Conqueror" },
    type_id: { type: Schema.Types.ObjectId, ref: "AdminType" },
    last_login: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
type AdminModeType = InferSchemaType<typeof AdminMode>;
export default mongoose.model<AdminModeType>("Admin", AdminMode);
