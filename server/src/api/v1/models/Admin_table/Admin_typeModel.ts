import mongoose, { InferSchemaType } from "mongoose";
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
export default mongoose.model<InferSchemaType<typeof AdminType>>(
  "AdminType",
  AdminType
);
