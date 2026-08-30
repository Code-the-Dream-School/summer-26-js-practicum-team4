import React, { useState } from "react";

function PrivacyPage() {
  const [selectedSection, setSelectedSection] = useState("introduction");

  const sections = {
    introduction: {
      title: "Introduction",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            X-Stitch is a platform that helps users transform photos and
            artwork into custom cross-stitch patterns. This Privacy Policy
            explains what information we collect, how we use it, and the
            choices available to you.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            This project is intended for educational and demonstration
            purposes. While we strive to follow modern privacy practices,
            this website should not be considered a commercial production
            service.
          </p>
        </>
      ),
    },

    collection: {
      title: "Data We Collect",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            We may collect account information such as usernames, email
            addresses, and profile information when users register for an
            account.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            We may also temporarily process uploaded images in order to
            generate cross-stitch patterns. Images are used solely for
            pattern generation functionality.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            Basic technical information such as browser type, device
            information, and application logs may also be collected to
            improve performance and troubleshoot issues.
          </p>
        </>
      ),
    },

    usage: {
      title: "How We Use Your Data",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            Information is used to provide account functionality, generate
            patterns, personalize user experiences, and improve the platform.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            We do not sell personal information to third parties. Any data
            collected is used only to support application functionality and
            user experience.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            Usage analytics may be reviewed to identify bugs, improve
            performance, and develop future features.
          </p>
        </>
      ),
    },

    security: {
      title: "Security",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            We take reasonable measures to protect user information from
            unauthorized access, disclosure, or misuse.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            However, no online service can guarantee complete security.
            Users should avoid sharing sensitive personal information
            through uploaded content.
          </p>
        </>
      ),
    },

    retention: {
      title: "Data Retention",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            User information is retained only as long as necessary to
            provide services and maintain application functionality.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            Uploaded files may be removed periodically to conserve storage
            and improve system performance.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            Users may request account deletion, which may remove associated
            information from active systems.
          </p>
        </>
      ),
    },

    contact: {
      title: "Contact Us",
      content: (
        <>
          <p className="text-lg leading-relaxed text-text">
            If you have questions about this Privacy Policy or the handling
            of your information, please contact the X-Stitch development
            team through the project repository or support channels.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-text">
            Since this is a demonstration project, support responses may be
            limited and should not be considered guaranteed service.
          </p>
        </>
      ),
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-primary py-24 text-center text-white">
        <h1 className="text-6xl font-bold">Privacy Policy</h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl">
          Learn how X-Stitch collects, stores, and protects your information
          while you create and share cross-stitch patterns.
        </p>

        <p className="mt-4 text-md opacity-80">Last Updated: August 2026</p>
      </section>

      <div className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
          <article className="space-y-20">
            <section>
              <h2 className="mb-6 text-4xl font-bold text-secondary">
                {sections[selectedSection].title}
              </h2>

              {sections[selectedSection].content}
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-border bg-background p-8 shadow-sm lg:sticky lg:top-10">
            <h2 className="mb-8 text-3xl font-bold text-secondary">
              Table of Contents
            </h2>

            <nav className="flex flex-col gap-5">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSection(key)}
                  className={`text-left text-lg transition ${
                    selectedSection === key
                      ? "font-semibold text-primary underline"
                      : "text-text hover:text-primary hover:underline"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;