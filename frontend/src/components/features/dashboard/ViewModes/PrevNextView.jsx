import React, { useState } from "react";

import PatternViewer from "../PatternViewer";

function PrevNextView({ patterns, dispatch, dashActions, dashState }) {
  const patternsLength = patterns.length;
  const [scrollPatternIx, setScrollPatternIx] = useState(0);

  function handleButtonClick(e, direction) {
    // right arrow
    dispatch({ direction, type: dashActions.setScrollPatternIx });
  }

  return (
    <div className="scroll-view">
      <button
        className="scroll-controller"
        onClick={() =>
          dispatch({ direction: "-", type: dashActions.setScrollPatternIx })
        }
      >
        Previous
      </button>
      <PatternViewer pattern={patterns[dashState.scrollPatternIx]} />
      <button
        className="scroll-controller"
        onClick={() =>
          dispatch({ direction: "+", type: dashActions.setScrollPatternIx })
        }
      >
        Next
      </button>
    </div>
  );
}

export default PrevNextView;
