import React from "react";

function DownloadPatternBtn({ pattern }) {
  return (
    <>
      <a href={pattern.patternImgUrl} target="_blank" rel="noreferrer" download>
        <button>Download</button>
      </a>
    </>
  );
}

export default DownloadPatternBtn;
