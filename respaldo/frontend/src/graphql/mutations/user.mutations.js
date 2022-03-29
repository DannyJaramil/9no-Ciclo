import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation CreateUser($user: UserInput) {
    createUser(user: $user) {
      message
      id
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userUpdated: UserInput!, $id: ID!) {
    updateUser(userUpdated: $userUpdated, id: $id) {
      message
      id
    }
  }
`;
