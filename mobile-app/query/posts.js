import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

export const POST_DETAIL = gql`
  query PostById($postByIdId: ID) {
    postById(id: $postByIdId) {
      _id
      content
      tags
      imgUrl
      authorId
      author {
        _id
        name
        username
        email
      }
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($form: PostForm) {
    addPost(form: $form) {
      _id
      content
      tags
      imgUrl
      authorId
      createdAt
      updatedAt
      comments {
        content
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const LIKE = gql`
  mutation Mutation($postId: ID) {
    addLike(postId: $postId)
  }
`;

export const COMMENT = gql`
  mutation Mutation($postId: ID, $form: CommentForm) {
    addComment(postId: $postId, form: $form)
  }
`;