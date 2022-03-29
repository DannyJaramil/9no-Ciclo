import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  code: {
    type: String,
    maxlength: 25,
    trim: true,
    unique: true,
    uppercase: true,
  },
  auxiliar_code: {
    type: String,
    maxlength: 25,
    trim: true,
    unique: true,
    uppercase: true,
  },
  product_type: {
    type: String,
    trim: true,
  },
  prices: [
    {
      value: Number,
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  aditional_details: String,
  measurement_unit: {
    type: String,
    maxlength: 20,
  },
  cost: {
    type: Number,
    default: 0,
  },
  tags: [String],
  bulk_sale: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  taxes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tax",
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  modified_at: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model("Product", ProductSchema);
