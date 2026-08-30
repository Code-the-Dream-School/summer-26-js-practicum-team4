import React from "react";
import { Link } from "react-router-dom";


function CTASection() {
  return (
    <section className="bg-background py-32">
      <div className="mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl font-bold">Get Started Today</h2>

        <p className="mt-6 max-w-2xl text-lg">
          X-Stitch is free to use, designed to help you turn your favorite
          photos into stitch-ready patterns in minutes. No downloads, no
          installs — just open your browser and start creating.
        </p>

        <div className="mt-10 flex gap-6">
          <Link to="/register">
            <button className="rounded-lg bg-primary px-12 py-4 text-lg text-white hover:opacity-90">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
