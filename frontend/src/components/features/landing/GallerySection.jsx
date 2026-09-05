import React from "react";
import { useState, useEffect } from "react";
import { Repeat } from "lucide-react";

const finishedPages = [
  [
    "images/landing-page-pattern1.jpg",
    "images/landing-page-pattern2.webp",
    "images/landing-page-pattern3.png",
  ],
  [
    "images/landing-page-pattern4.jpg",
    "images/landing-page-pattern5.webp",
    "images/landing-page-pattern6.jpg",
  ],
  [
    "images/landing-page-pattern7.jpg",
    "images/landing-page-pattern8.jpg",
    "images/landing-page-pattern9.avif",
  ],
];

const chartPages = [
  ["images/chart1.png", "images/chart2.png", "images/chart3.png"],
  ["images/chart4.png", "images/chart5.png", "images/chart6.png"],
  ["images/chart7.png", "images/chart8.png", "images/chart9.png"],
];

function GallerySection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showCharts, setShowCharts] = useState(false);

  const activeGallery = showCharts ? chartPages : finishedPages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % activeGallery.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeGallery.length]);

  return (
    <div className="bg-background px-25 py-16 pt-80">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Top Patterns Gallery</h2>

          <button
            onClick={() => setShowCharts((prev) => !prev)}
            className="flex items-center gap-2 rounded-full  border border-primary p-2 transition-all duration-300"
            title={showCharts ? "Show Finished Patterns" : "Show Stitch Charts"}
          >
            <Repeat size={24} className="text-primary" />

            <span className="text-base font-medium">
              {showCharts ? "View Charts" : "View Patterns"}
            </span>
          </button>
        </div>

        <p className="mt-4 text-xl">
          Discover more with our top rated patterns this month. Join now and
          share and explore your work today!
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {activeGallery[currentPage].map((image, index) => (
          <div
            key={`${currentPage}-${index}`}
            className="h-[30vw] max-h-[600px] min-h-[300px] overflow-hidden rounded-xl"
          >
            <img
              src={image}
              alt="Pattern"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3 py-8">
        {activeGallery.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-3 w-3 rounded-full ${
              currentPage === index ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default GallerySection;
