import React from "react";

function DownloadPattern({ pattern }) {
  return (
    <a href={pattern.patternImgUrl} target="_blank" rel="noreferrer" download>
      <p>Download</p>
    </a>
  );
}

export default DownloadPattern;
