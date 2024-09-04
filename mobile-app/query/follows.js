import { gql } from "@apollo/client";

export const FOLLOW = gql`
  mutation Mutation($followingId: ID) {
    addFollow(followingId: $followingId)
  }
`;

export const GET_FOLLOWS = gql`
  query Query {
    follows {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;