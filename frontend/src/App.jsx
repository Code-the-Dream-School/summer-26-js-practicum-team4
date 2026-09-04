import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PublicNavbar from "./components/layout/PublicNavbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GeneratePage from "./pages/GeneratePage";
import MyPatternsPage from "./pages/MyPatternsPage";
import EditPage from "./pages/EditPage";
import GalleryPage from "./pages/GalleryPage";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import UserProfilePage from "./pages/UserProfilePage";
import NotFoundPage from "./pages/NotFound";
import { useAuth } from "./state/auth/useAuth";

function App() {
  const { state } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (state.isAuthenticated ? <Navbar /> : <PublicNavbar />)}

      <main className="main-content flex flex-1 flex-col ">
        <Routes>
          <Route
            path="/"
            element={
              state.isAuthenticated ? (
                <Navigate to="/generate" replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/mypatterns" element={<MyPatternsPage />} />
            <Route path="/edit/:patternId" element={<EditPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
