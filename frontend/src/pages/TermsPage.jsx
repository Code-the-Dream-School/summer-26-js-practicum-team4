import React from "react";

function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-primary py-24 text-center text-white">
        <h1 className="text-6xl font-bold">Terms of Service</h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl">
          A few guidelines for using X-Stitch and creating your patterns.
        </p>

        <p className="mt-4 text-md opacity-80">Last Updated: August 2026</p>
      </section>

      <div className="mx-auto max-w-5xl px-8 py-20">
        <article className="space-y-10 text-lg leading-relaxed text-text">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-secondary">
              1. Using X-Stitch
            </h2>
            <p>
              X-Stitch allows users to upload images and convert them into
              cross-stitch patterns, complete with grid charts, color palettes,
              and thread lists. By accessing or using the application, you agree
              to use the service only for lawful purposes and in a manner that
              does not infringe on the rights of, or restrict or inhibit the use
              and enjoyment of, X-Stitch by any third party. We reserve the
              right to update, modify, or discontinue any part of the service at
              any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-secondary">
              2. Your Content
            </h2>
            <p>
              You retain ownership of any images or other content you upload to
              X-Stitch. However, you are solely responsible for ensuring that
              you have the necessary rights, licenses, or permissions to use and
              upload that content. Do not upload images that are copyrighted by
              others, contain sensitive personal information, or otherwise
              violate the rights of any third party. We reserve the right to
              remove any content that we believe, in our sole discretion,
              violates these terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-secondary">
              3. Account Responsibility
            </h2>
            <p>
              When you create an account with X-Stitch, you agree to provide
              accurate and complete information and to keep that information up
              to date. You are responsible for maintaining the confidentiality
              of your login credentials and for all activity that occurs under
              your account. If you suspect any unauthorized use of your account,
              you should take reasonable steps to secure it, though we cannot
              guarantee the recovery of lost data or access.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-secondary">
              4. Service Availability
            </h2>
            <p>
              X-Stitch is provided on an ongoing, as-developed basis, and
              features, functionality, or content may be added, changed,
              removed, or made temporarily or permanently unavailable at any
              time as the application continues to evolve. We make no guarantee
              of uninterrupted access and are not liable for any downtime, data
              loss, or disruption to your workflow that may result from changes
              to the service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-secondary">
              5. Demo Project
            </h2>
            <p>
              X-Stitch is a group project built as part of CTD for educational
              and portfolio purposes. These terms are written to resemble a real
              Terms of Service agreement for demonstration purposes, but they
              are not intended to serve as a binding legal agreement, and
              X-Stitch should not be treated as a commercial, production-grade
              service.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

export default TermsPage;
