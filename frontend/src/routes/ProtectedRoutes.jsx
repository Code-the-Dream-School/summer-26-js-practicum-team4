import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../state/auth/useAuth";

function ProtectedRoutes() {
  const { state } = useAuth();

  if (state.loading) {
    return <div>Loading...</div>;
  }
  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;}
  export default ProtectedRoutes;

