import mongoose from "mongoose";
import type { AdmineType } from "../../../../types/modelTypes/Admin_table_types/AdminTypeModelTypes";
const Schema = mongoose.Schema;
const AdminType = new Schema(
  {
    admin_type: { type: String, required: [true, "admin type is required"] },
    Permissions: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
AdminType.virtual("id").get(function () {
  return this._id.toHexString();
});
export default mongoose.model<AdmineType>("AdminType", AdminType);
