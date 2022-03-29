import mongoose from "mongoose";

export const Invoice = mongoose.model("Invoice", {
    customer: {
        reference: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        address: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
    },
    emission_date: {
        type: Date,
        default: Date.now(),
    },
    emission_point: {
        type: String,
        trim: true
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
    aditional_information: {
        type: String,
        trim: true
    },
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
    credit: {
        time_limit: Date,
        amount: {
            type: Number,
            min: 0, 
        }
    }, 
    retentions: {
        rental: {
            type: Number,
            min: 0,
        },
        iva: {
            type: Number,
            min: 0,
        },
    },
    invoice_number:{
        type: String,
        unique: true
    },
    status:{
        type: String,
        trim: true,
        default: "Borrador"
    },
    authorized: {
        type: Boolean,
        default: false
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