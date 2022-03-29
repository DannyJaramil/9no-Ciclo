import mongoose, { Schema } from "mongoose";

const TaxSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    percentage: Number,
  },
  { timestamps: true }
);

export const Tax = mongoose.model("Tax", TaxSchema);
