import { gql } from "@apollo/client";

export const GET_EMISSION_POINTS = gql`
  query GetEmissionPoints($queries: Queries, $establishment: ID!) {
    emissionPoints(queries: $queries, establishment: $establishment) {
      id
      code
      description
      establishment{
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_EMISSION_POINT = gql`
  query GetEmissionPoint($id: ID!, $establishment: ID!) {
    emissionPoint(id: $id, establishment: $establishment) {
      id
      code
      description
      establishment{
        id
      }
    }
  }
`;

export const GET_ALL_EMISSION_POINTS = gql`
  query GetAllEmissionPoints {
    allEmissionPoints {
      id
      code
      description
      establishment {
        id
        code
      }
    }
  }
`;
