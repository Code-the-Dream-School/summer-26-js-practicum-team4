import React from "react";

import PatternViewer from "../PatternViewer";

function AllPatternView({ dashState, dashActions, dispatch }) {
  return (
    <>
      <div className="all-pattern-view">
        {dashState.patterns.map((pattern) => (
          <PatternViewer key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </>
  );
}

export default AllPatternView;
