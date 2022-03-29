import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
    },
    amount: {
        type: Number,
        min: 0, 
    },
    method:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentType",
    },
    notes: {
        type: String,
        trim: true
    },
    payment_date: {
        type: Date,
        default: Date.now,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});

export const Payment = mongoose.model("Payment", PaymentSchema);