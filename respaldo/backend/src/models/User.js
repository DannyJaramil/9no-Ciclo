import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  user_type: {
    type: Schema.Types.ObjectId,
    ref: "UserType",
  },
  business_name: {
    type: String,
    trim: true,
  },
  tradename: {
    type: String,
    trim: true,
  },
  dni_type: {
    type: String,
    trim: true,
  },
  dni: {
    type: String,
    trim: true,
    unique: true,
  },
  address: {
    type: String,
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  special_taxpayer: {
    type: Boolean,
    default: false,
  },
  aditional_information: {
    type: String,
    trim: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
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

export const User = mongoose.model("User", UserSchema);
