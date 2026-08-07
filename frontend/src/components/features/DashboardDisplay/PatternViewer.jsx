import React from "react";

// Component Imports
import DownloadPatternBtn from "./DownloadPatternBtn";

function PatternViewer({ pattern }) {
  console.log(pattern);
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <DownloadPatternBtn pattern={pattern} />
    </>
  );
}

export default PatternViewer;
