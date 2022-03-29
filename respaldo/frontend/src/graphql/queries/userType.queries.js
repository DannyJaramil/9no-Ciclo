import { gql } from "@apollo/client";

export const GET_USER_TYPES = gql`
  query GetUserTypes {
    userTypes {
      id
      name
      active
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_TYPE = gql`
  query GetUserType($id: ID!) {
    userType(id: $id) {
      id
      name
      active
      deleted
    }
  }
`;
