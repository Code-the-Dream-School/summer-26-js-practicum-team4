import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Component Imports
import DownloadPatternBtn from "../../shared/DownloadPatternBtn";
import DeletePatternBtn from "../../shared/DeletePatternBtn";
import PatternNameEditInput from "../../shared/PatternNameEditInput";
import PatternCanvasPreview from "../../pattern/PatternCanvasPreview";

import { useAuth } from "../../../../state/auth/useAuth";

const pageOrigin = {
  dashboard: {
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete:
      "grid grid-cols-[25%_1%_25%] justify-center gap-x-5 my-8",
    image: "mx-auto p-10 h-full object-contain",
  },
};

function PatternViewerScroll({ pattern, page, setPatternToPrint, canvasRef }) {
  // Relevant states
  const { state, dispatch } = useAuth();

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
        {patternEditInterface()}
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
};

export default PatternViewerScroll;
