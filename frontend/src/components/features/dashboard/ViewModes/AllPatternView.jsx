import React, { useContext } from "react";

import PatternViewerAll from "../../shared/PatternDisplays/PatternViewerAll";
import CreateNewPatternIcon from "../PatternDisplays/CreateNewPatternIcon";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView() {
  const { dashState } = useContext(DashContext);
  return (
    <>
      <div className="all-pattern-view mx-20 mt-10 grid grid-cols-3">
        {dashState.patterns.map((pattern) => (
          <PatternViewerAll
            key={pattern.id}
            pattern={pattern}
            page="dashboard"
          />
        ))}
        <CreateNewPatternIcon patternDisplayScaling="h-[45dvh]" />
      </div>
    </>
  );
}

export default AllPatternView;
