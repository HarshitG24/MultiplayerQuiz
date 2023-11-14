import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      statusCode
      message
    }
  }
`;

export const SIGN_UP_GOOGLE = gql`
  mutation ($accessToken: String!) {
    signUpGoogle(accessToken: $accessToken) {
      accessToken
      refreshToken
      email
    }
  }
`;
