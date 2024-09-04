require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { userTypeDefs, userResolvers } = require("./schema/user");
const { postTypeDefs, postResolvers } = require("./schema/post");
const { followTypeDefs, followResolvers } = require("./schema/follow");

const { verifyToken } = require("./helpers/jwt");
const User = require("./models/user");
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: PORT },
  context: ({ req }) => {
    async function authentication() {
      // Get the user token from the headers.
      const authorization = req.headers.authorization || "";

      // console.log(req.headers, "<<<<<<<< authorization");
      if (!authorization) throw new Error("invalid token");

      const [type, token] = authorization.split(" ");
      if (type !== "Bearer") throw new Error("invalid token");

      const payload = verifyToken(token);

      // Try to retrieve a user with the token
      const user = await User.findByPk(payload._id);

      // Add the user to the context
      return user;
    }
    return {
      authentication,
    };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
