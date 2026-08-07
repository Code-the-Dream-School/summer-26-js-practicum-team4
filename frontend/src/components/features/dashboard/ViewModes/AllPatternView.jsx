import React from "react";

import PatternViewer from "../PatternViewer";

function AllPatternView({ patterns }) {
  return (
    <>
      <div className="all-pattern-view">
        {patterns.map((pattern) => (
          <PatternViewer key={pattern.id} pattern={pattern} />
        ))}
      </div>
    </>
  );
}

export default AllPatternView;
