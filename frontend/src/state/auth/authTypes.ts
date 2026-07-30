import type { Dispatch } from "react";

import type { User } from "../user/userTypes";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: "AUTH_CHECKED" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };


export interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}