import React from "react";
import { logout } from "../../../services/authService";
import { useAuth } from "../../../state/auth/useAuth";

function LogoutBtn() {
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
    <button onClick={handleLogout} disabled={loading}>
      Logout
    </button>
  );
}

export default LogoutBtn;
