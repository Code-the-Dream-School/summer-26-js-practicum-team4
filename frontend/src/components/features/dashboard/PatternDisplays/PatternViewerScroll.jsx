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
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete: "flex justify-center gap-x-15 my-8",
    image: "mx-auto p-10 h-full object-contain",
  },
};

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
      console.log(pattern);
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
          className={`pattern-interface container flex content-center justify-center mx-auto h-[60dvh] bg-white border rounded-2xl border-gray-400`}
          tabIndex={0}
          aria-label="Scrollable pattern chart"
        >
          <PatternCanvasPreview pattern={pattern} cellSize={16} />
        </div>
        <div className={pageOrigin[page].downloadAndDelete}>
          <DownloadPatternBtn pattern={pattern} />
          <DeletePatternBtn pattern={pattern} />
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
    palette: PropTypes.string.isRequired,
    grid: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  page: PropTypes.string.isRequired,
};

export default PatternViewerScroll;
