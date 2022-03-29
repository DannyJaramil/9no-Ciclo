import mongoose, { Schema } from "mongoose";

const UserTypeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const UserType = mongoose.model("UserType", UserTypeSchema);
