import { gql } from "@apollo/client";

export const GET_ESTABLISHMENTS = gql`
  query GetEstablishments($queries: Queries) {
    establishments(queries: $queries) {
      id
      code
      commercialName
      shortName
      province
      city
      address
      phone
      email
      createdAt
      updatedAt
    }
  }
`;

export const GET_ESTABLISHMENT = gql`
  query GetEstablishment($id: ID!) {
    establishment(id: $id) {
      id
      code
      logo
      commercialName
      shortName
      province
      city
      address
      phone
      email
    }
  }
`;
