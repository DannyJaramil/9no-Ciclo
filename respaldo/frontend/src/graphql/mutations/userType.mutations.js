import { gql } from "@apollo/client";

export const CREATE_USER_TYPE = gql`
  mutation CreateUserType($userType: UserTypeInput!) {
    createUserType(userType: $userType) {
      message
      id
    }
  }
`;

export const UPDATE_USER_TYPE = gql`
  mutation UpdateUserType($userType: UserTypeInput!, $id: ID!) {
    updateUserType(userType: $userType, id: $id) {
      message
      id
    }
  }
`;
