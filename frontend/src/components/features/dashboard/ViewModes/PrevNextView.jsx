import React, { useState, useContext } from "react";

// Component Imports
import PatternViewer from "../PatternViewer";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PrevNextView() {
  const { dispatch, dashActions, dashState } = useContext(DashContext);
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
      <PatternViewer pattern={dashState.patterns[dashState.scrollPatternIx]} />
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
