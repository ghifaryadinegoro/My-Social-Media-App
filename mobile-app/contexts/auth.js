const { createContext, useState } = require("react");

export const AuthContext = createContext({
  isSignedIn: false,
  user: null,
});

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}
