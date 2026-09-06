import React from "react";
import PropTypes from "prop-types";

// Component Imports
import DownloadPatternBtn from "../../shared/DownloadPatternBtn";
import DeletePatternBtn from "../../shared/DeletePatternBtn";
import PatternCanvasPreview from "../../pattern/PatternCanvasPreview";
import PatternNameComponent from "../../shared/PatternNameComponent";

const pageOrigin = {
  dashboard: {
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete: "grid grid-cols-[25%_25%] justify-center gap-x-5 my-8",
    image: "mx-auto p-10 h-full object-contain",
  },
};

function PatternViewerScroll({ pattern, page, setPatternToPrint, canvasRef }) {
  return (
    <>
      <div className="container">
        <PatternNameComponent
          pattern={pattern}
          textStyle={pageOrigin[page].textStyle}
        />
        <div
          className={`pattern-interface container flex content-center justify-center mx-auto h-[60dvh] bg-white border rounded-2xl border-gray-400`}
          tabIndex={0}
          aria-label="Scrollable pattern chart"
        >
          <PatternCanvasPreview pattern={pattern} cellSize={16} />
        </div>
        <div className={pageOrigin[page].downloadAndDelete}>
          <DownloadPatternBtn
            origin="dashScroll"
            pattern={pattern}
            canvasRef={canvasRef}
            setPatternToPrint={setPatternToPrint}
          />
          <DeletePatternBtn origin="dashScroll" pattern={pattern} />
        </div>
      </div>
    </>
  );
}

PatternViewerScroll.propTypes = {
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
  page: PropTypes.string.isRequired,
  setPatternToPrint: PropTypes.func,
  canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default PatternViewerScroll;
