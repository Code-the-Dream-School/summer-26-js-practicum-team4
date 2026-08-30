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
import GalleryPage from "./pages/GalleryPage";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import UserProfilePage from "./pages/UserProfilePage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import HelpPage from "./pages/HelpPage";
import { useAuth } from "./state/auth/useAuth";

function App() {
  const { state } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!isAuthPage && (state.isAuthenticated ? <Navbar /> : <PublicNavbar />)}

      <main className="main-content">
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
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpPage />} />

          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/mypatterns" element={<MyPatternsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
