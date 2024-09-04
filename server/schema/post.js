const redis = require("../config/redis");
const Post = require("../models/post");

const postTypeDefs = `#graphql

  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String
    updatedAt: String
  }
  
  type Query {
    # GET /posts
    posts: [Post]

    # GET /posts/:id
    postById(id: ID): Post
  }

  input PostForm {
    content: String!
    tags: [String]
    imgUrl: String
  }

  input CommentForm {
    content: String!
  }

  type Mutation {
    # POST /add
    addPost(form: PostForm): Post

    #POST /:id/comments
    addComment(postId: ID,form: CommentForm): String

    #POST /:id/like
    addLike(postId: ID): String
  }
`;

const postResolvers = {
  Query: {
    posts: async (parent, args, contextValue) => {
      const user = await contextValue.authentication();

      const cachePosts = await redis.get("posts:all")

      if(cachePosts) {
        return JSON.parse(cachePosts)
      }
      const result = await Post.findAll();

      await redis.set("posts:all", JSON.stringify(result))

      return result; 
    },
    postById: async (parent, args, contextValue) => {
      const user = await contextValue.authentication();
      let result = await Post.findByPk(args.id);
      console.log(result, '<<<<<Res');
      return result
    },
  },
  Mutation: {
    addPost: async (parent, { form }, contextValue) => {
      if (!form.content) throw new Error("content is required");

      const user = await contextValue.authentication();

      form.authorId = user._id;
      form.createdAt = form.updatedAt = new Date().toISOString();
      const result = await Post.create(form);

      await redis.del("posts:all")

      return result;
    },

    addComment: async (parent, { postId, form }, contextValue) => {
      if (!form.content) throw new Error("Content is required");

      const user = await contextValue.authentication();

      form.username = user.username;
      const result = await Post.push(postId, "comments", form);

      await redis.del("posts:all");

      return "comment has been posted";
    },

    addLike: async (parent, { postId }, contextValue) => {
      const user = await contextValue.authentication();

      let likedUsers = {
        username: user.username,
      };
      
      
      let findPost = await Post.findByPk(postId);
      console.log(findPost, "<<<<<< findPostLikes");
      // if (findPost.likes.find((el) => el.username === user.username)) {
      //   throw new Error("already like this post");
      // }

      const result = await Post.push(postId, "likes", likedUsers);
      
      await redis.del("posts:all");

      return "success like post";
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
