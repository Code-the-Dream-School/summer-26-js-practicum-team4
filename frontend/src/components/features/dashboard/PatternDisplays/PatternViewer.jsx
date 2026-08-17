import React from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementBtns/DeletePatternBtn";

function PatternViewer({ pattern }) {
  return (
    <>
      <div className="pattern-interface">
        <h3>{pattern.patternName}</h3>
        <img src={pattern.patternImgUrl} height={200} width={200} />
        <DownloadPatternBtn pattern={pattern} />
        <DeletePatternBtn pattern={pattern} />
      </div>
    </>
  );
}

export default PatternViewer;
