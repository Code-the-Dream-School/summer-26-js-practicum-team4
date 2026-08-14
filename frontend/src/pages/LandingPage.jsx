import React from "react";
import HeroSection from "../components/features/landing/HeroSection";
import HowItWorksSection from "../components/features/landing/HowItWorksSection";
import GallerySection from "../components/features/landing/GallerySection";
import ReviewsSection from "../components/features/landing/ReviewsSection";
import CTASection from "../components/features/landing/CTASection";

function LandingPage() {
  return (
    <div>
      <div className="bg-white">
        <HeroSection />

        <HowItWorksSection />
      </div>

      <GallerySection />

      <ReviewsSection />

      <CTASection />
    </div>
  );
}

export default LandingPage;
