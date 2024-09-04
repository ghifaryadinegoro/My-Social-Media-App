const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const Follow = require("../models/follow");
const User = require("../models/user");

const userTypeDefs = `#graphql

  type User {
    _id: ID
    name: String
    username: String
    email: String
    # password: String
  }

  type UserByIdResponse {
    user: User
    followers: [User]
    followings: [User]
  }
  
  type Query {
    # GET /users
    users: [User]

    # GET /users/:id
    userById(id: ID): UserByIdResponse

    #GET /searchUser
    searchUsers(keyword: String): [User]
  }

  input RegisterForm {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input LoginForm {
    username: String!
    password: String!
  }

  type LoginResponse {
    _id: ID,
    email: String,
    username: String
    access_token: String,
  }

  type Mutation {
    # POST /register
    register(form: RegisterForm): User

    # POST /login
    login(form: LoginForm): LoginResponse
  }
`;

// Validate email
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const userResolvers = {
  Query: {
    users: async (parent, args, contextValue) => {
      await contextValue.authentication();
      return await User.findAll();
    },
    userById: async (parent, args, contextValue) => {
      let loggedUser = await contextValue.authentication();
      console.log(loggedUser, "<<<<<< loggedUser");
      

      let user = await User.findByPk(args.id);

      if(!user) {
        user = await User.findByPk(loggedUser._id);
      }
      console.log(user, "<<<<<< user");
      

      // if(args.id) {
      //   user = await User.findByPk(args.id);
      // }
      // else {
      //   user = await User.findByPk(loggedUser._id);
      // }

      let followers = []
      let followings = []

      let follower = await Follow.col().aggregate([
        {
          $match: {
            followingId: user._id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower",
          },
        },
        {
          $unwind: {
            path: "$follower",
          },
        },
      ]).toArray();

      let following = await Follow.col().aggregate([
        {
          $match: {
            followerId: user._id,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingId",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $unwind: {
            path: "$following",
          },
        },
      ]).toArray();

      console.log(user, "<<<< user", followers, "<<<<<<<< follower", followings, "<<<<<< following");

      follower.map(el => {
        followers.push(el.follower)
      })
      following.map(el => {
        followings.push(el.following)
      })
      

      return {
        user,
        followers,
        followings,
      };
    },
    searchUsers: async (parent, args, contextValue) => {
      await contextValue.authentication();
      const { keyword } = args;
      const result = await User.search(keyword);

      return result;
    },
  },
  Mutation: {
    register: async (parent, { form }) => {
      if (!form.name) throw new Error("name is required");

      if (!form.username) throw new Error("username is required");

      const getUserByUsername = await User.findOne({ username: form.username });

      if (getUserByUsername) throw new Error("username must be unique");

      if (!form.email) throw new Error("email is required");

      if (!validateEmail(form.email))
        throw new Error("email format is not valid");

      const getUserByEmail = await User.findOne({ email: form.email });

      if (getUserByEmail) throw new Error("email must be unique");

      if (!form.password) throw new Error("password is required");

      if (form.password.length < 5)
        throw new Error("minimum password is 5 characters");

      const result = await User.create(form);
      return result;
    },
    login: async (parent, { form }) => {
      if (!form.username || form.username.length === 0) {
        throw new Error("username is required");
      }
      if (!form.password || form.password.length === 0) {
        throw new Error("password is reqired");
      }

      const user = await User.findOne({ username: form.username });

      if (!user) throw new Error("invalid username/password");

      const validPassword = comparePassword(form.password, user.password);

      if (!validPassword) throw new Error("invalid username/password");

      return {
        _id: user._id,
        email: user.email,
        username: user.username,
        access_token: signToken({ _id: user._id }),
      };
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolvers,
};
