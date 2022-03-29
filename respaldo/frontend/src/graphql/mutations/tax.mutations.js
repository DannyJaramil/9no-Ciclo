import { gql } from "@apollo/client";

export const CREATE_TAX = gql`
  mutation CreateTax($tax: TaxInput!) {
    createTax(tax: $tax) {
      message
      id
    }
  }
`;

export const UPDATE_TAX = gql`
  mutation UpdateTax($tax: TaxInput!, $id: ID!) {
    updateTax(tax: $tax, id: $id) {
      message
      id
    }
  }
`;
