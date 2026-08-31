import React from "react";

function HowItWorksSection() {
  return (
    <section className="relative z-10 mx-auto -mb-60 w-[90%] rounded-4xl bg-primary py-20 px-12 text-white">
      <h2 className="mb-16 text-center text-4xl font-bold">
        How does X-Stitch work?
      </h2>

      <div className="flex flex-col items-center gap-20 md:flex-row md:items-start md:justify-center">
        <div className="flex max-w-sm flex-col items-center text-center">
          <img
            src="images/upload.png"
            alt="Step 1"
            className="w-14 md:w-20 lg:w-20"
          />
          <h3 className="mt-6 text-3xl font-semibold">1. Upload</h3>
          <p className="mt-4 text-xl">
            Drop your favorite photo or illustration. We support JPEG, PNG, and
            WEBP files up to 20MB.
          </p>
        </div>

        <div className="flex max-w-sm flex-col items-center text-center">
          <img
            src="images/edit.png"
            alt="Step 2"
            className="w-14 md:w-20 lg:w-20"
          />
          <h3 className="mt-6 text-3xl font-semibold">2. Adjust</h3>
          <p className="mt-4 text-xl">
            Adjust the dimensions, color palette, and reassign symbols to create
            your perfect pattern.
          </p>
        </div>

        <div className="flex max-w-sm flex-col items-center text-center">
          <img
            src="images/grid.png"
            alt="Step 3"
            className="w-14 md:w-20 lg:w-20"
          />
          <h3 className="mt-6 text-3xl font-semibold">3. Stitch</h3>
          <p className="mt-4 text-xl">
            Download your interactive chart and color coded thread list to start
            stitching your masterpiece!
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
