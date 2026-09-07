import React from "react";
import PropTypes from "prop-types";

// Component Imports

import DownloadPatternBtn from "../../shared/DownloadPatternBtn";
import DeletePatternBtn from "../../shared/DeletePatternBtn";
import DashEdit from "../PatternManagementTools/DashEdit";

import PatternNameComponent from "../../shared/PatternNameComponent";
import PatternCanvasPreview from "../../pattern/PatternCanvasPreview";

const pageOrigin = {
  dashboard: {
    textStyle: "text-2xl ml-5",
    subTextStyle: "ml-5",
    patternInterface: "m-2 h-[45dvh]",
    downloadAndEdit:
      "absolute top-0 left-0 text-right ml-4 object-contain grid grid-cols-6",
    image: "mx-auto p-5 h-[70%] object-contain",
  },
};

const monthsLst = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDate(dateTimeStr) {
  const yrMthDay = dateTimeStr.split("T")[0].split("-");

  const monthStr = monthsLst[parseInt(yrMthDay[1] - 1)];
  const dayStr = yrMthDay[2] + ",";
  const yearStr = yrMthDay[0];

  return [monthStr, dayStr, yearStr].join(" ");
}

function PatternViewerAll({ pattern, page, setPatternToPrint, canvasRef }) {
  return (
    <>
      <div className="container">
        <div
          className={`pattern-interface relative bg-white border rounded-2xl border-gray-400 ${pageOrigin[page].patternInterface}`}
        >
          <PatternCanvasPreview
            pattern={pattern}
            cellSize={16}
            styling="absolute top-0 left-0 w-full h-full"
          />
          <div className={pageOrigin[page].downloadAndEdit}>
            <DashEdit pattern={pattern} />
            <DownloadPatternBtn
              origin="dashAll"
              pattern={pattern}
              canvasRef={canvasRef}
              setPatternToPrint={setPatternToPrint}
            />
          </div>
          <div className="absolute top-0 right-0 text-right mr-4 mt-1 object-contain">
            <DeletePatternBtn origin="dashAll" pattern={pattern} />
          </div>
        </div>
        <PatternNameComponent
          pattern={pattern}
          textStyle={pageOrigin[page].textStyle}
          setCurrentPatternName=""
          showEditBtn={false}
        />
        <h3 className={pageOrigin[page].subTextStyle}>
          Created {getDate(pattern.createdAt)}
        </h3>
      </div>
    </>
  );
}

PatternViewerAll.propTypes = {
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

export default PatternViewerAll;
