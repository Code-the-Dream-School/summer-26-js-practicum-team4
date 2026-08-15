import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const galleryPages = [
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
function GallerySection() {
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % galleryPages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background pt-80 px-25 py-16">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Top Patterns Gallery</h2>
          <Link
            to="/gallery"
            className="text-lg font-normal hover:font-semibold hover:underline"
          >
            Full Gallery
          </Link>
        </div>

        <p className="mt-4 text-xl">
          Discover more with our top rated patterns this month. Join now and
          share and explore your work today!
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {galleryPages[currentPage].map((image, index) => (
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
        {galleryPages.map((_, index) => (
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
