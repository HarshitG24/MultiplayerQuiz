import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation ($email: String!, $password: String!, $confirmPassword: String!) {
    signup(
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      statusCode
      message
    }
  }
`;
