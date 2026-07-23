// App.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GeneratePage from "./pages/GeneratePage";
import MyPatternsPage from "./pages/MyPatternsPage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/mypatterns" element={<MyPatternsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
       
      </Routes>

      <Footer />
    </>
  );
}

export default App;