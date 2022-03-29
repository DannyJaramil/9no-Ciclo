import { gql } from "@apollo/client";

export const CREATE_PAYMENT_TYPE = gql`
  mutation CreatePaymentType($paymentType: PaymentTypeInput!) {
    createPaymentType(paymentType: $paymentType) {
      message
      id
    }
  }
`;

export const UPDATE_PAYMENT_TYPE = gql`
  mutation UpdatePaymentType($paymentType: PaymentTypeInput!, $id: ID!) {
    updatePaymentType(paymentType: $paymentType, id: $id) {
      message
      id
    }
  }
`;
