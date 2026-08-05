import React from "react";

function PatternViewer({ pattern }) {
  console.log(pattern);
  return <img src={pattern.patternImgUrl} height={200} width={200} />;
}

export default PatternViewer;
