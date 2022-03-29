import { AuthenticationError } from "apollo-server-express";
import { Invoice } from "../models/Invoice";
import { Payment } from "../models/Payment";
import {  PurchaseInvoice} from "../models/PurchaseInvoice";

const getPayments = async (_, { offset, limit, queries }, { user }) => {
    if(user){
        const { search } = queries;
        let aditionalSearch = search ? {}:{};

        const payments = await Payment.find(aditionalSearch)
            .populate({
                path: "invoice",
                populate: {
                    path: "customer.reference"
                }
            })
            .populate('method')
            .sort({ _id: 'desc' })
            .skip(limit * offset - limit)
            .limit(limit);

        const total = await Payment.countDocuments(aditionalSearch);

        return { payments, total };
    }

    throw new AuthenticationError("Sorry, you're not an authenticated user!");
};

const getPaymentsById = async (_, { id }, { user }) => {
    if(user){
        const payments = await Payment.find({ invoice: id })
            .populate('method')
            .sort({ _id: 'desc' });
            
        return payments;
    }

    throw new AuthenticationError("Sorry, you're not an authenticated user!");
}

const createPayment = async (_, { payment }, { user }) => {
    if(user){
        const invoice = await Invoice.findOne({ _id: payment.invoice });
        if(invoice){
            if(invoice.pending_balance >= payment.amount){
                const new_payment = new Payment(payment);
                await new_payment.save();

                invoice.pending_balance -= payment.amount;
                invoice.total_paid += payment.amount;
                await invoice.save();
                
                return {
                    id: new_payment.id,
                    message: "El pago ha sido registrado correctamente."
                }
            }else
                throw new Error("The amount entered exceeds the pending value!");            
        }else
            throw new Error("Invoice not found!");
    }

    throw new AuthenticationError("Sorry, you're not an authenticated user!");
};





const createPaymentPurcharseIn = async (_, { payment }, { user }) => {
    if(user){
        const purcharsInvoice= await PurchaseInvoice.findOne({_id: payment.invoice});

       

        if(purcharsInvoice){
            if(purcharsInvoice.pending_balance >= payment.amount){
                const new_payment = new Payment(payment);
                await new_payment.save();

                 //var numerica = parseFloat(payment.amount);
            
                 console.log("el valor que viene del frente es "+payment.amount)
                purcharsInvoice.pending_balance -= payment.amount;

                //console.log("el valor sin redondear es"+ (purcharsInvoice.pending_balance - payment.amount));
                purcharsInvoice.pending_balance =(parseFloat((   purcharsInvoice.pending_balance ).toFixed(2)));
                //purcharsInvoice.pending_balance =(parseFloat((  invoice.pending_balance ).toFixed(2)));


                purcharsInvoice.total_paid += payment.amount;
                await purcharsInvoice.save();
                return {
                    id: new_payment.id,
                    message: "El pago ha sido registrado correctamente."
                }
            }else{
                return {
                    id: null,
                    message: "El monto excede la deuda Actual"
                }  
            }          
        }else{

            return {
                id: null,
                message: "No se encontro la Factura"
            }
        }
            
    }

    throw new AuthenticationError("Sorry, you're not an authenticated user!");
};



export const PaymentResolver = {
    getPayments,
    getPaymentsById,
    createPayment,
    createPaymentPurcharseIn
};