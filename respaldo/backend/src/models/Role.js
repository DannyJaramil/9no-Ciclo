import mongoose from "mongoose";

export const Role = mongoose.model("Role", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    permissions: [{
        resource: String,
        action: String,
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
    modified_at: {
        type: Date,
        default: Date.now,
    },
})