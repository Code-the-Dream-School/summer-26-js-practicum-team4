import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useAuth } from "../../../state/auth/useAuth";

function DownloadPatternBtn({
  origin,
  pattern,
  canvasRef,
  setPatternToPrint = "",
}) {
  // Relevant states
  const { dispatch } = useAuth();

  useEffect(() => {
    if (
      setPatternToPrint &&
      (origin === "dashAll" || origin === "dashScroll")
    ) {
      setPatternToPrint(pattern);
    }
  }, [origin, pattern, setPatternToPrint, canvasRef]);

  function handleDownload() {
    setPatternToPrint(pattern);
    dispatch({ type: "BEGIN_DOWNLOADING" });
    window.print();
    dispatch({ type: "END_DOWNLOADING" });
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
        <button
          onClick={handleDownload}
          className="rounded-lg border border-border bg-surface px-5 py-2.5 font-semibold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Download Pattern
        </button>
      );
    }
    return { message: "No view selected." };
  }
  return <>{requestOrigin()}</>;
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
  setPatternToPrint: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default DownloadPatternBtn;
