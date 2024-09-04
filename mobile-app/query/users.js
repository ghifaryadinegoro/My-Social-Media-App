import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($form: LoginForm) {
    login(form: $form) {
      _id
      email
      username
      access_token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($form: RegisterForm) {
    register(form: $form) {
      _id
      name
      username
      email
    }
  }
`;

export const GET_USER = gql`
  query Query($userByIdId: ID) {
    userById(id: $userByIdId) {
      user {
        _id
        name
        username
        email
      }
      followers {
        _id
        name
        username
        email
      }
      followings {
        _id
        name
        username
        email
      }
    }
  }
`;

export const SEARCH_USERS = gql`
  query Query($keyword: String) {
    searchUsers(keyword: $keyword) {
      _id
      name
      username
      email
    }
  }
`;
