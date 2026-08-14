import React from "react";

function CTASection() {
  return (
    <section className="bg-background py-32">
      <div className="mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl font-bold">Get Started Today</h2>

        <p className="mt-6 max-w-2xl text-lg">
          X-Stitch is free to download, designed to help you cross-stitch the
          moment you open it. Available now on IOS and Android!
        </p>

        <div className="mt-10 flex gap-6">
          <button className="rounded-md bg-primary px-12 py-4 text-lg text-white">
            App Store
          </button>

          <button className="rounded-md bg-primary px-12 py-4 text-lg text-white">
            Google Play
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
