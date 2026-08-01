import React, { useReducer } from "react";
import { authReducer, initialState } from "./authReducer";
import { AuthContext } from "./authContext";
import PropTypes from "prop-types";



export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
