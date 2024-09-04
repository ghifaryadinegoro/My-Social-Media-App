import AuthProvider from "./contexts/auth";
import Navigation from "./navigation";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./config/apolloClient";

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <Navigation />
      </ApolloProvider>
    </AuthProvider>
  );
}
