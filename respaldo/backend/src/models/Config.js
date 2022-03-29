import mongoose from "mongoose";

export const Config = mongoose.model("Config", {
    key: {
        type: String,
        trim: true
    },
    value: {
        numeric: Number,
        text: {
            type: String,
            trim: true
        }
    }
});