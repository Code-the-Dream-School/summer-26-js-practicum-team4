import React from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementBtns/DeletePatternBtn";

function PatternViewerAll({ pattern }) {
  return (
    <>
      <div className="container mx-auto">
        <div className="pattern-interface bg-white border rounded-2xl border-gray-400">
          <DownloadPatternBtn pattern={pattern} />
          <DeletePatternBtn pattern={pattern} />
          <img
            className="mx-auto pt-10 pb-10"
            src={pattern.patternImgUrl}
            height={200}
            width={200}
          />
        </div>
        <h2 className="text-3xl mb-5">{pattern.patternName}</h2>
      </div>
    </>
  );
}

export default PatternViewerAll;
