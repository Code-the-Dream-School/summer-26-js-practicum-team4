import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";
import Loader from "../components/Loader/Loader";

function PublicRoutes() {
  const { state } = useAuth();
  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader size={200} />
      </div>
    );
  }
  return state.isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}

export default PublicRoutes;
