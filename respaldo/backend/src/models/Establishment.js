import mongoose, { Schema } from "mongoose";

const EstablishmentSchema = new Schema(
  {
    logo: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    commercialName: {
      type: String,
      trim: true,
    },
    shortName: {
      type: String,
      trim: true,
    },
    province: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Establishment = mongoose.model(
  "Establishment",
  EstablishmentSchema
);
