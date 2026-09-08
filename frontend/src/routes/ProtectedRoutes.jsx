import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";
import Loader from "../components/Loader/Loader";

function ProtectedRoutes() {
  const { state } = useAuth();

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader size={200} />
      </div>
    );
  }

  return state.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
