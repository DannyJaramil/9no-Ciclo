import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($offset: Int!, $limit: Int!, $queries: Queries) {
    products(offset: $offset, limit: $limit, queries: $queries) {
      products {
        id
        code
        product_type
        description
        prices {
          value
        }
        tags
        status
        taxes {
          id
          type
        }
      }
      total
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      code
      auxiliar_code
      product_type
      prices {
        value
      }
      bulk_sale
      cost
      description
      aditional_details
      taxes {
        id
        type
      }
    }
  }
`;

export const GET_SUGGESTIONS = gql`
  query GetSuggestions($search: String!) {
    productSuggestions(search: $search) {
      id
      code
      description
      prices {
        value
      }
      cost
      taxes {
        type
        name
        percentage
      }
    }
  }
`;
