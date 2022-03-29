import { gql } from "@apollo/client";

export const ADD_PURCHASE_INVOICE = gql`
    mutation CreatePurchaseInvoice($invoice: PurchaseInvoiceInput){
        createPurchaseInvoice(invoice: $invoice){
            id,
            message
        }
    }
`;

export const EDIT_PURCHASE_INVOICE = gql`
    mutation UpdatePurchaseInvoice($invoice: PurchaseInvoiceInput, $id: ID){
        updatePurchaseInvoice(invoice: $invoice, id: $id){
            id
            message
        }
    }
`;