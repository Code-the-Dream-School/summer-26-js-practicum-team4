import React from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementBtns/DeletePatternBtn";

function PatternViewerScroll({ pattern }) {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-3xl mb-5">{pattern.patternName}</h2>
        <div className="pattern-interface bg-white border rounded-2xl border-gray-400">
          <img
            className="mx-auto pt-10 pb-10"
            src={pattern.patternImgUrl}
            height={200}
            width={200}
          />
        </div>
        <div className="flex justify-center gap-x-15 my-8">
          <DownloadPatternBtn pattern={pattern} />
          <DeletePatternBtn pattern={pattern} />
        </div>
      </div>
    </>
  );
}

export default PatternViewerScroll;
