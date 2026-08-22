import React, { useContext } from "react";

import PatternViewer from "../PatternDisplays/PatternViewer";
import CreateNewPatternIcon from "../PatternDisplays/CreateNewPatternIcon";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView() {
  const { dashState } = useContext(DashContext);
  return (
    <>
      <div className="all-pattern-view">
        {dashState.patterns.map((pattern) => (
          <PatternViewer key={pattern.id} pattern={pattern} />
        ))}
        <CreateNewPatternIcon />
      </div>
    </>
  );
}

export default AllPatternView;
