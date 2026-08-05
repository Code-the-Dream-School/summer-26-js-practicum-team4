import React from "react";
import { logout } from "../../../services/authService";
import { useAuth } from "../../../state/auth/useAuth";

function LogoutBtn() {
  const { dispatch } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  }

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutBtn;
