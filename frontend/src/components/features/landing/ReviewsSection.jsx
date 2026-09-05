import React from "react";
import { Info } from "lucide-react";

function ReviewsSection() {
  return (
    <section className="mx-auto px-20 py-24">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">Reviews</h2>

        <div className="relative group">
          <button
            className="rounded-full p-2 transition-all duration-300 hover:bg-black/5"
            aria-label="About these reviews"
          >
            <Info size={32} className="text-primary" />
          </button>

          <div className="absolute right-0 top-full z-10 mt-2 hidden w-80 rounded-lg bg-white p-4 text-left shadow-lg group-hover:block">
            <p className="font-semibold text-primary">About these reviews:</p>
            <p className="mt-1 text-md text-gray-600">
              These are sample testimonials created for the X-Stitch demo and
              are not from real users.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xl">
        Join a growing community of users who use X-Stitch to create custom
        patterns, share their work, and bring their favorite photos to life.
      </p>

      <div className="grid gap-8 py-8 md:grid-cols-3">
        <div className="flex h-[32vw] min-h-[450px] max-h-[500px] flex-col items-center justify-center rounded-xl bg-background p-8 text-center text-text">
          <img
            src="images/user-profile.png"
            alt="Anne"
            className="h-20 w-20 rounded-full"
          />

          <h3 className="mt-4 text-2xl font-semibold">Anne</h3>

          <img src="images/stars.png" alt="5 stars" className="mt-2 w-28" />

          <p className="mt-6 max-w-xs text-lg italic">
            &quot;X-Stitch has completely changed the way I approach
            cross-stitching. The ability to turn my favorite photos into
            patterns is a game-changer!&quot;
          </p>
        </div>

        <div className="flex h-[32vw] min-h-[450px] max-h-[500px] flex-col items-center justify-center rounded-xl bg-background p-8 text-center text-text">
          <img
            src="images/user-profile.png"
            alt="Betty"
            className="h-20 w-20 rounded-full"
          />

          <h3 className="mt-4 text-2xl font-semibold">Betty</h3>

          <img src="images/stars.png" alt="5 stars" className="mt-2 w-28" />

          <p className="mt-6 max-w-xs text-lg italic">
            &quot;I love how easy it is to adjust the grid size and color
            palette. It allows me to create patterns that are truly
            unique.&quot;
          </p>
        </div>

        <div className="flex h-[32vw] min-h-[450px] max-h-[500px] flex-col items-center justify-center rounded-xl bg-background p-8 text-center text-text">
          <img
            src="images/user-profile.png"
            alt="Steve"
            className="h-20 w-20 rounded-full"
          />

          <h3 className="mt-4 text-2xl font-semibold">Steve</h3>

          <img src="images/stars.png" alt="5 stars" className="mt-2 w-28" />

          <p className="mt-6 max-w-xs text-lg italic">
            &quot;The downloadable charts and thread lists make it so convenient
            to start stitching right away. Highly recommend X-Stitch!&quot;
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReviewsSection;
