import React from "react";

// Component Imports
import DownloadBtn from "./downloadBtn";

function PatternViewer({ pattern }) {
  console.log(pattern);
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <DownloadBtn pattern={pattern} />
    </>
  );
}

export default PatternViewer;
