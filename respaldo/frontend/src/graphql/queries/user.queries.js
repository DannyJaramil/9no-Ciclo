import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query GetCustomers($offset: Int!, $limit: Int!, $queries: Queries) {
    customers(offset: $offset, limit: $limit, queries: $queries) {
      users {
        id
        user_type {
          id
          name
        }
        dni
        business_name
        tradename
        phone_number
        created_at
        modified_at
      }
      total
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      business_name
      tradename
      user_type {
        id
        name
      }
      dni_type
      dni
      address
      phone_number
      aditional_information
      email
      special_taxpayer
    }
  }
`;

export const GET_SUGGESTIONS = gql`
  query GetSuggestions($search: String!) {
    customerSuggestions(search: $search) {
      id
      business_name
      dni
      address
      account {
        email
      }
    }
  }
`;
