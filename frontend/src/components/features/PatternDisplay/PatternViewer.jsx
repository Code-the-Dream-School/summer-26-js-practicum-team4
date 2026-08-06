import React from "react";

// Component Imports
import DownloadPattern from "./DownloadPattern";

function PatternViewer({ pattern }) {
  console.log(pattern);
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <DownloadPattern pattern={pattern} />
    </>
  );
}

export default PatternViewer;
