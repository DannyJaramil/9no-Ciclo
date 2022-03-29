import { gql } from "@apollo/client";

export const CREATE_ESTABLISHMENT = gql`
  mutation CreateEstablishment($establishment: EstablishmentInput!) {
    createEstablishment(establishment: $establishment) {
      message
      id
    }
  }
`;

export const UPDATE_ESTABLISHMENT = gql`
  mutation UpdateEstablishment($establishment: EstablishmentInput!, $id: ID!) {
    updateEstablishment(establishment: $establishment, id: $id) {
      message
      id
    }
  }
`;
