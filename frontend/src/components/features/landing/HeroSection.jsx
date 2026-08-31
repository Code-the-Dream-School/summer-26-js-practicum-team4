import React from "react";
import { Link } from "react-router-dom";

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
            Custom grid density, color palette, and printable PDF.
          </p>
          <Link to="/register">
            <button className="mt-8 rounded-lg bg-primary px-12 py-4 text-lg text-white hover:opacity-90">
              Start Now
            </button>
          </Link>
        </div>

        <div className="relative h-[45vw] max-h-[680px] w-[55%]">
          <div className="absolute -right-10 top-0 h-[80%] w-[80%] rounded-[40%] opacity-70 blur-2xl" />

          <svg
            className="absolute left-0 top-8 z-20 h-40 w-40 overflow-visible text-primary"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M5 90 Q 42 65 30 30 T 90 10 Q 115 25 100 95"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="1 8"
              strokeLinecap="round"
            />
          </svg>

          <img
            src="/images/landing-page-second.png"
            alt="Close-up of orange and brown embroidery threads"
            className="absolute bottom-[6%] right-0 z-10 w-[48%] rotate-3 rounded-2xl border-4 border-white object-cover shadow-2xl"
          />

          <img
            src="/images/landing-page-first.png"
            alt="Person cross-stitching"
            className="absolute left-[8%] top-[8%] z-20 aspect-square w-[62%] -rotate-3 rounded-2xl border-4 border-white object-cover shadow-2xl"
          />

          <svg
            className="absolute -bottom-8 -right-4 z-0 h-40 w-40 overflow-visible text-primary"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M95 60 Q 60 42 90 70 T -85 48"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="1 8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
