import React, { useState } from "react";

import PatternViewer from "../PatternViewer";

function PrevNextView({ dispatch, dashActions, dashState }) {
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
      <PatternViewer
        pattern={dashState.patterns[dashState.scrollPatternIx]}
        dashState={dashState}
        dashActions={dashActions}
        dispatch={dispatch}
      />
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
