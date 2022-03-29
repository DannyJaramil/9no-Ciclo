import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
    mutation CreatePayment($payment: PaymentInput) {
        createPayment(payment: $payment) {
            id
            message
        }
    }
`;



export const CREATE_PAYMENT_PURCHARSE = gql`
mutation CreatePymenPurcharse( $payment:PaymentInput){
  createPaymentPurcharseInvoice(payment:$payment ){
    message
    id
  }
}
    
`;