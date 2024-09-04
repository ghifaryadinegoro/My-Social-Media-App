const { ObjectId } = require("mongodb");
const Follow = require("../models/follow");

const followTypeDefs = `#graphql

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
    # follower: User
    # following: User
  }

  
  type Query {
    follows: [Follow]
  }
  type Mutation {
    # POST /follow
    addFollow(followingId: ID): String
  }
`;

const followResolvers = {
  Query: {
    follows: async (parent, args, contextValue) => {
      await contextValue.authentication();
      return await Follow.findAll();
    },
  },
  Mutation: {
    addFollow: async (parent, { followingId }, contextValue) => {
      const user = await contextValue.authentication();

      console.log(followingId, "<<<<< followingId Before");
      
      let data;
      if (followingId) {
        data = {
          followingId: new ObjectId(followingId),
          followerId: user._id,
        };
      } else {
        throw new Error("please input followingId");
      }
      console.log(data, "<<<<< data Before");
      
      const findFollow = await Follow.findOne({
        followingId: new ObjectId(followingId),
        followerId: data.followerId,
      });
      console.log(findFollow, "<<<< findFollow Before");
      
      if (findFollow) {
        console.log(data, "<<<<< data After");
        await Follow.deleteFollow(data.followingId, data.followerId);
        return "Success unfollow this user";
      }
      // console.log(findFollow, "<<<< findFollow After");
      // console.log(
        //   data.followingId,
        //   "<<<< followingId",
        //   data.followerId,
        //   "<<<<<<<<<< followerIdData"
        // );
        // console.log(data.followingId == data.followerId);
        
      if (data.followingId !== data.followerId) {
        const result = await Follow.create(data);

        return `success follow user`;
      }
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolvers,
};
