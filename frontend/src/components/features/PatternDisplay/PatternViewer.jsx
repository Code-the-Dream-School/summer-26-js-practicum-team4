import React from "react";

function PatternViewer({ pattern }) {
  console.log(pattern);
  return <img src={pattern.patternImgUrl} />;
}

export default PatternViewer;
