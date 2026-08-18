import React, { useContext } from "react";

import PatternViewerAll from "../PatternDisplays/PatternViewerAll";
import CreateNewPatternIcon from "../PatternDisplays/CreateNewPatternIcon";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView() {
  const { dashState } = useContext(DashContext);
  return (
    <>
      <div className="all-pattern-view flex flex-wrap mx-20 mt-10">
        {dashState.patterns.map((pattern) => (
          <PatternViewerAll key={pattern.id} pattern={pattern} />
        ))}
        <CreateNewPatternIcon />
      </div>
    </>
  );
}

export default AllPatternView;
