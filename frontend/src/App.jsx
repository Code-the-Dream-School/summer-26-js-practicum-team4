// App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GeneratePage from "./pages/GeneratePage";
import MyPatternsPage from "./pages/MyPatternsPage";
import GalleryPage from "./pages/GalleryPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/mypatterns" element={<MyPatternsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
