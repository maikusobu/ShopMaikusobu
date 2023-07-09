import mongoose from "mongoose";
const { Schema } = mongoose;
const BaseSchema = new Schema(
  {
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
export default BaseSchema;
