import { useContext } from "react";
import { AuthContext } from "./authContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context is not available");
  }

  return context;
};