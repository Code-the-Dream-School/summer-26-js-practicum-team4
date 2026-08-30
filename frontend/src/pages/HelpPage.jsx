import React from "react";

function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-primary py-24 text-center text-white">
        <h1 className="text-6xl font-bold">How Can We Help?</h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl">
          Find answers to common questions about creating and managing your
          cross-stitch patterns.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="min-h-[220px] overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="h-2 bg-primary" />
            <div className="p-10">
              <h2 className="text-2xl font-bold text-secondary">
                Creating a Pattern
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-text">
                Head to the Generate page and upload an image. Adjust your
                settings and generate a cross-stitch pattern from your image.
              </p>
            </div>
          </div>

          <div className="min-h-[220px] overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="h-2 bg-primary" />
            <div className="p-10">
              <h2 className="text-2xl font-bold text-secondary">
                Editing a Pattern
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-text">
                Open one of your saved patterns to adjust settings such as
                dimensions, colors, and stitch options.
              </p>
            </div>
          </div>

          <div className="min-h-[220px] overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="h-2 bg-primary" />
            <div className="p-10">
              <h2 className="text-2xl font-bold text-secondary">
                My Patterns
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-text">
                Your saved patterns can be found on the My Patterns page,
                where you can view and manage your creations.
              </p>
            </div>
          </div>

          <div className="min-h-[220px] overflow-hidden rounded-2xl bg-white shadow-md">
            <div className="h-2 bg-primary" />
            <div className="p-10">
              <h2 className="text-2xl font-bold text-secondary">
                Account Questions
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-text">
                Use your profile to manage your account information and
                access your X-Stitch settings.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl bg-primary text-white shadow-lg">
          <div className="px-8 py-16 text-center">
            <h2 className="text-3xl font-bold">Still need help?</h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed opacity-90">
              X-Stitch is a group project built as part of CTD, so additional
              support resources are not currently available.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HelpPage;