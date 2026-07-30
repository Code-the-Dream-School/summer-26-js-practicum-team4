import { useReducer } from "react";
import { authReducer, initialState } from "./authReducer";
import type {ReactNode } from "react";
import {AuthContext} from "./authContext";
export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};