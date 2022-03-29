import { gql } from "@apollo/client";

export const CREATE_EMISSION_POINT = gql`
  mutation CreateEmissionPoint($emissionPoint: EmissionPointInput!) {
    createEmissionPoint(emissionPoint: $emissionPoint) {
      message
      id
    }
  }
`;

export const UPDATE_EMISSION_POINT = gql`
  mutation UpdateEmissionPoint($emissionPoint: EmissionPointInput!, $id: ID!) {
    updateEmissionPoint(emissionPoint: $emissionPoint, id: $id) {
      message
      id
    }
  }
`;
