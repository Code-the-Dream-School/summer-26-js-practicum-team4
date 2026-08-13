import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";

function PublicRoutes() {
  const { state } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }
  return state.isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}

export default PublicRoutes;
