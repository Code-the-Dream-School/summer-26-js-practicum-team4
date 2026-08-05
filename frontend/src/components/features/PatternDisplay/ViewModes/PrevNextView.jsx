import React, { useState } from "react";

import PatternViewer from "../PatternViewer";

function PrevNextView({ patterns }) {
  const patternsLength = patterns.length;
  const [patternIx, setPatternIx] = useState(0);

  function handleButtonClick(e, direction) {
    // right arrow
    if (direction === "+") {
      const nextPatternIx = patternIx + 1;

      if (nextPatternIx < patternsLength) {
        setPatternIx(nextPatternIx);
      } else {
        console.log("No next pattern!"); // placeholder action
      }
    }

    // left arrow
    else if (direction === "-") {
      const prevPatternIx = patternIx - 1;

      if (prevPatternIx >= 0) {
        setPatternIx(prevPatternIx);
      } else {
        console.log("No previous pattern!"); // placeholder action
      }
    }
    return;
  }

  return (
    <div className="scroll-view">
      <button
        className="scroll-controller"
        onClick={(e) => handleButtonClick(e, "-")}
      >
        Previous
      </button>
      <PatternViewer pattern={patterns[patternIx]} />
      <button
        className="scroll-controller"
        onClick={(e) => handleButtonClick(e, "+")}
      >
        Next
      </button>
    </div>
  );
}

export default PrevNextView;
