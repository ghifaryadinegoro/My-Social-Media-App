import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";

const httpLink = createHttpLink({
  // ngrok Link
  // uri: "http://localhost:4000/graphql",
  // uri: "https://107f-158-140-175-239.ngrok-free.app",
  uri: "https://mobileapp-server.gdevjs.site",
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await SecureStore.getItemAsync("access_token");
  // console.log(headers, "<<<<<<< headers");
  console.log(token, "<<<<<<< token");
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
