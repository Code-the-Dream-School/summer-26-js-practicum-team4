import React, { useContext } from "react";

import PatternViewerAll from "../PatternDisplays/PatternViewerAll";
import PatternViewer from "../PatternDisplays/PatternViewer";
import CreateNewPatternIcon from "../PatternDisplays/CreateNewPatternIcon";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView() {
  const { dashState } = useContext(DashContext);
  return (
    <>
      <div className="all-pattern-view mx-20 mt-10 grid grid-cols-3">
        {dashState.patterns.map((pattern) => (
          <PatternViewer key={pattern.id} pattern={pattern} view="all" />
        ))}
        <CreateNewPatternIcon />
      </div>
    </>
  );
}

export default AllPatternView;
