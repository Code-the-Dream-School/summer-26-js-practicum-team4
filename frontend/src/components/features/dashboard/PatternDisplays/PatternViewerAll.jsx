import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Component Imports

import DownloadPatternBtn from "../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";
import PatternCanvasPreview from "../../pattern/PatternCanvasPreview";

import { useAuth } from "../../../../state/auth/useAuth";

const pageOrigin = {
  dashboard: {
    textStyle: "text-2xl ml-5",
    subTextStyle: "ml-5",
    patternInterface: "m-2 h-[45dvh]",
    downloadAndDelete:
      "absolute top-0 right-0 text-right mr-2 mt-2 object-contain grid grid-cols-[25%_15%_25%]",
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

function PatternViewerAll({ pattern, page }) {
  // Relevant states
  const { state, dispatch } = useAuth();

  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [currentPatternName, setCurrentPatternName] = useState(
    pattern.patternName,
  );

  // Refs
  const editFocus = useRef("");
  const canvasRef = useRef(null);

  // Focus on editing field if useRef has a non-empty reference
  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [state.isEditing]);

  function handleEdit() {
    if (state.isEditing) {
      return;
    }

    setCurrentPatternName(pattern.patternName);
    setEditingThisPattern(true);

    dispatch({ type: "BEGIN_PATTERN_NAME_EDITING" });

    return;
  }

  function patternEditInterface() {
    if (state.isEditing && editingThisPattern) {
      return (
        <PatternNameEditInput
          patternId={pattern.id}
          defaultPatternName={pattern.patternName}
          currentPatternName={currentPatternName}
          setCurrentPatternName={setCurrentPatternName}
          setEditingThisPattern={setEditingThisPattern}
          ref={editFocus}
          textStyle={pageOrigin[page].textStyle}
        />
      );
    } else {
      return (
        <div className="grid grid-cols-5 place-content-center">
          <h2 className={pageOrigin[page].textStyle}>{pattern.patternName}</h2>
          <button className="col-start-6" onClick={handleEdit}>
            <img
              src="images/edit.png"
              className="hover:bg-gray-300 mb-5 w-10"
            />
          </button>
        </div>
      );
    }
  }
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
          <div className={pageOrigin[page].downloadAndDelete}>
            <DeletePatternBtn pattern={pattern} /> : <></>
            <DownloadPatternBtn
              origin="dashAll"
              pattern={pattern}
              canvasRef={canvasRef}
            />
          </div>
        </div>
        {patternEditInterface()}
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
};

export default PatternViewerAll;
