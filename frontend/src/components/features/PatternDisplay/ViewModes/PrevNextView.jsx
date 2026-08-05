import React, { useState } from "react";

import PatternViewer from "../PatternViewer";

function PrevNextView({ patterns }) {
  const patternsLength = patterns.length;
  const [patternIx, setPatternIx] = useState(0);

  function handleButtonClick(e, direction) {
    // right arrow
    if (direction === "+") {
      const nextPatternIx = patternIx + 1;

      if (nextPatternIx <= patternsLength) {
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
        onClick={(e) => handleButtonClick(e, "+")}
      ></button>
      {patternsLength === 0 ? (
        <h1>You have no patterns</h1>
      ) : (
        <PatternViewer pattern={patterns[patternIx]} />
      )}
      <button
        className="scroll-controller"
        onClick={(e) => handleButtonClick(e, "-")}
      ></button>
      <h1>Prev/Next View triggered!</h1>
    </div>
  );
}

export default PrevNextView;
