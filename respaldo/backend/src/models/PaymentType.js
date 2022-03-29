import mongoose, { Schema } from "mongoose";

const PaymentTypeSchema = new Schema(
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

export const PaymentType = mongoose.model("PaymentType", PaymentTypeSchema);
