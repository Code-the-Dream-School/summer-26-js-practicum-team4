import React, { useState, useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Component Imports

import DownloadPatternBtn from "../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";
import PatternCanvasPreview from "../../pattern/PatternCanvasPreview";

import { DashContext } from "../../../../state/dashboard/dashContext";

const pageOrigin = {
  dashboard: {
    textStyle: "text-2xl ml-5",
    subTextStyle: "ml-5",
    patternInterface: "m-2 h-[45dvh]",
    downloadAndDelete: "text-right mr-2 mt-2 object-contain",
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
  const { dashState, dashActions, dispatch } = useContext(DashContext);

  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [currentPatternName, setCurrentPatternName] = useState(
    pattern.patternName,
  );

  const editFocus = useRef("");

  // Focus on editing field if useRef has a non-empty reference
  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [dashState.isEditing]);

  function handleEdit() {
    if (dashState.isEditing) {
      return;
    }

    setCurrentPatternName(pattern.patternName);
    setEditingThisPattern(true);

    dispatch({ type: dashActions.beginEditing });

    return;
  }

  function patternEditInterface() {
    if (dashState.isEditing && editingThisPattern) {
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
          className={`pattern-interface bg-white border rounded-2xl border-gray-400 ${pageOrigin[page].patternInterface}`}
        >
          <div className={pageOrigin[page].downloadAndDelete}>
            <DownloadPatternBtn pattern={pattern} />
            <DeletePatternBtn pattern={pattern} /> : <></>
          </div>
          <PatternCanvasPreview pattern={pattern} cellSize={16} />
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
    palette: PropTypes.string.isRequired,
    grid: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  page: PropTypes.string.isRequired,
};

export default PatternViewerAll;
