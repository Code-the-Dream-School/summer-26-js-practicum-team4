import React from "react";

function HeroSection() {
  return (
    <section className="px-20 py-20 pb-22">
      <div className="flex items-center gap-8 px-20">
        <div className="w-[45%]">
          <h1 className="text-6xl font-bold leading-tight">
            Turn your favorite photos into stitch-ready patterns!
          </h1>

          <p className="mt-8 text-xl italic">
            Transform any memory into a beautiful cross-stitch chart in seconds.
            Custom grid density, color matching, and printable PDF.
          </p>

          <button className="mt-8 rounded-lg bg-primary px-12 py-4 text-lg text-white hover:bg-primary-hover">
            Start Now
          </button>
        </div>

        <div className="relative h-[45vw] max-h-[650px] w-[55%]">
          <img
            src="/images/landing-page-first.avif"
            alt="Landing Page"
            className="absolute right-[30%] bottom-10 z-10 w-[50%] h-auto rounded-xl"
          />

          <img
            src="/images/landing-page-second.png"
            alt="Landing Page"
            className="absolute right-[10%] top-[3%] z-0 w-[30%] h-auto rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
