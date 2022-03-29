import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
  mutation CreateProduct($product: ProductInput) {
    createProduct(product: $product) {
      message
      id
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($productUpdated: ProductInput!, $id: ID!) {
    updateProduct(productUpdated: $productUpdated, id: $id) {
      message
      id
    }
  }
`;
