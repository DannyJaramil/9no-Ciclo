import { gql } from "@apollo/client";

export const ADD_INVOICE = gql`
    mutation CreateInvoice($invoice: InvoiceInput){
        createInvoice(invoice: $invoice){
            id
            message
        }
    }
`;

export const EDIT_INVOICE = gql`
    mutation UpdateInvoice($invoice: InvoiceInput, $id: ID){
        updateInvoice(invoice: $invoice, id: $id){
            id
            message
        }
    }
`;