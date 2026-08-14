import React from "react";

// Component Imports
import DownloadPatternBtn from "./PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./PatternManagementBtns/DeletePatternBtn";

function PatternViewer({ pattern }) {
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <h3>{pattern.patternName}</h3>
      <DownloadPatternBtn pattern={pattern} />
      <DeletePatternBtn pattern={pattern} />
    </>
  );
}

export default PatternViewer;
