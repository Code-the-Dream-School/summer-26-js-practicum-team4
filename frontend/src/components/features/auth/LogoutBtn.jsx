import React from "react";
import { logout } from "../../../services/authService";
import { useAuth } from "../../../state/auth/useAuth";
import PropTypes from "prop-types";

function LogoutBtn({ className }) {
  
  const {
    dispatch,
    state: { loading },
  } = useAuth();

  async function handleLogout() {
    dispatch({ type: "SET_LOADING" });
    try {
      await logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }

  return (
    <button className={className} onClick={handleLogout} disabled={loading}>
      Logout
    </button>
  );
}

LogoutBtn.propTypes = {
  className: PropTypes.string,
};

export default LogoutBtn;
