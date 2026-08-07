import React from "react";

import PatternViewer from "../PatternViewer";

function AllPatternView({ dashState, dashActions, dispatch }) {
  return (
    <>
      <div className="all-pattern-view">
        {dashState.patterns.map((pattern) => (
          <PatternViewer
            key={pattern.id}
            pattern={pattern}
            dashState={dashState}
            dashActions={dashActions}
            dispatch={dispatch}
          />
        ))}
      </div>
    </>
  );
}

export default AllPatternView;
