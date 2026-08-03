import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (userData, jwt) => {
    localStorage.setItem("token", jwt);

    setToken(jwt);

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
