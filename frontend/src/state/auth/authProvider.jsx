import React, { useReducer, useEffect } from "react";
import { authReducer, initialState } from "./authReducer";
import { AuthContext } from "./authContext";
import PropTypes from "prop-types";
import { getCurrentUser } from "../../services/authService";

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } catch (error) {
        if (error.status === 401) {
          dispatch({ type: "LOGOUT" });
        } else {
          dispatch({ type: "SET_ERROR", payload: error.message });
        }
      }
    };

    checkCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
