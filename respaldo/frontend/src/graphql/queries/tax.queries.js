import { gql } from "@apollo/client";

export const GET_TAXES = gql`
  query GetTaxes {
    taxes {
      id
      name
      type
      description
      percentage
      createdAt
      updatedAt
    }
  }
`;

export const GET_TAX = gql`
  query GetTax($id: ID!) {
    tax(id: $id) {
      id
      name
      type
      description
      percentage
    }
  }
`;
