import mongoose from "mongoose";

export const PurchaseInvoice = mongoose.model("PurchaseInvoice", {
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    emission_date: {
        type: Date,
        default: Date.now(),
    },
    max_payment_date: {
        type: Date,
        default: Date.now(),
    },
    referral_guide: {
        type: String,
        trim: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                min: 0, 
            },
            price: {
                type: Number,
                min: 0, 
            },
            discount: {
                type: Number,
                min: 0,
            },
            subtotal: {
                type: Number,
                min: 0, 
            },
        }
    ],
    subtotal: {
        type: Number,
        min: 0, 
    },
    iva_value: {
        type: Number,
        min: 0, 
    },
    ice_value: {
        type: Number,
        min: 0, 
    },
    total: {
        type: Number,
        min: 0, 
    },
    pending_balance: {
        type: Number,
        min: 0, 
    },
    total_paid: {
        type: Number,
        min: 0, 
    },
    invoice_number:{
        type: String,
        unique: true
    },
    status:{
        type: String,
        trim: true,
        default: "Autorizado"
    },
    auth_number: {
        type: String,
        trim: true,
    },
    modified_at: {
        type: Date,
        default: Date.now(),
    },
});