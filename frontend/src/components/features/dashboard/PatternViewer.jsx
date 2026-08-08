import React from "react";

// Component Imports
import DownloadPatternBtn from "./DownloadPatternBtn";
import DeletePatternBtn from "./DeletePatternBtn";

function PatternViewer({ pattern }) {
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <DownloadPatternBtn pattern={pattern} />
      <DeletePatternBtn pattern={pattern} />
    </>
  );
}

export default PatternViewer;
