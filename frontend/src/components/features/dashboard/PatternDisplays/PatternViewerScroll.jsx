import React, { useState, useContext, useRef, useEffect } from "react";

// Component Imports
import DownloadPatternBtn from "../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";

import { DashContext } from "../../../../state/dashboard/dashContext";

const pageOrigin = {
  dashboard: {
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete: "flex justify-center gap-x-15 my-8",
    image: "mx-auto p-10 h-full object-contain",
  },
  gallery: {
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete: "flex justify-center gap-x-15 my-8",
    image: "mx-auto p-10 h-full object-contain",
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

function PatternViewerScroll({ pattern, page }) {
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
        {patternEditInterface()}

        <div
          className={`pattern-interface bg-white border rounded-2xl border-gray-400 ${pageOrigin[page].patternInterface}`}
        >
          <img
            className={pageOrigin[page].image}
            src={pattern.patternImgUrl}
            alt={pattern.patternName}
          />
        </div>
        <div className={pageOrigin[page].downloadAndDelete}>
          <DownloadPatternBtn pattern={pattern} />
          <DeletePatternBtn pattern={pattern} />
        </div>
      </div>
    </>
  );
}

export default PatternViewerScroll;
