import React, { useState, useEffect } from "react";

import PatternCanvas from "../../pattern/PatternCanvas";

function DownloadPatternBtn({ origin, pattern, canvasRef }) {
  // Relevant states
  const [refStatus, setRefStatus] = useState(false);

  useEffect(() => {}, [refStatus, setRefStatus, canvasRef, origin]);

  function renderCanvas() {
    return (
      <div className={"invisible max-h-0 max-w-0"}>
        <PatternCanvas pattern={pattern} cellSize={8} canvasRef={canvasRef} />
      </div>
    );
  }

  function handleDownload() {
    let downloadLink = document.createElement("a");
    downloadLink.download = "frunk.png";

    canvasRef.current.toBlob((blob) => {
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.click();
    }, "image/png");
  }

  function requestOrigin() {
    if (origin === "dashAll") {
      return (
        <button onClick={handleDownload}>
          <img
            src="images/all-pattern-download.png"
            className="max-w-10 hover:bg-gray-300"
          />
        </button>
      );
    }
    if (origin === "dashScroll") {
      return (
        <button
          onClick={handleDownload}
          className="bg-primary text-white px-10 py-2 border border-black rounded-md hover:bg-accent"
        >
          Download
        </button>
      );
    }

    if (origin === "generatePg") {
      return (
        <button onClick={handleDownload}>
          <img
            src="images/all-pattern-download.png"
            className="max-w-10 hover:bg-gray-300"
          />
        </button>
      );
    }
    return { message: "No view selected." };
  }
  return (
    <>
      {requestOrigin()}
      {origin === "dashAll" || origin === "dashScroll" ? renderCanvas() : <></>}
    </>
  );
}

export default DownloadPatternBtn;
