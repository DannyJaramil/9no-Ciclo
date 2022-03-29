import { gql } from "@apollo/client";

export const GET_PAYMENT_TYPES = gql`
  query GetPaymentTypes {
    paymentTypes {
      id
      name
      active
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const GET_PAYMENT_TYPE = gql`
  query GetPaymentType($id: ID!) {
    paymentType(id: $id) {
      id
      name
      active
      deleted
    }
  }
`;
