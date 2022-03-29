import mongoose, { Schema } from "mongoose";

const EmissionPointSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    establishment: {
      type: Schema.Types.ObjectId,
      ref: "Establishment",
    },
  },
  { timestamps: true }
);

export const EmissionPoint = mongoose.model(
  "EmissionPoint",
  EmissionPointSchema
);
