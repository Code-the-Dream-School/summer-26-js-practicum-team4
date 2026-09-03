import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import PatternCanvas from "../pattern/PatternCanvas";

function DownloadPatternBtn({ origin, pattern, canvasRef, patternName = "" }) {
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

    const downloadName = patternName ? patternName : pattern.patternName;

    downloadLink.download = `${downloadName}.png`;

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

DownloadPatternBtn.propTypes = {
  origin: PropTypes.string.isRequired,
  pattern: PropTypes.shape({
    id: PropTypes.number.isRequired,
    patternName: PropTypes.string.isRequired,
    stitchWidth: PropTypes.number.isRequired,
    stitchHeight: PropTypes.number.isRequired,
    palette: PropTypes.arrayOf(
      PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    grid: PropTypes.arrayOf(PropTypes.number).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  patternName: PropTypes.string,
};

export default DownloadPatternBtn;
