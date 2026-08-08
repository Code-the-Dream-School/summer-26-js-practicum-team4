import React, { useContext } from "react";

import PatternViewer from "../PatternViewer";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView() {
  const { dashState, dispatch, dashActions } = useContext(DashContext);
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
