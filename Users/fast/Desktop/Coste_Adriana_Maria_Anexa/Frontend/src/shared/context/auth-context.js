import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  role: "",
  token: null,
  login: () => {},
  logout: () => {},
});
