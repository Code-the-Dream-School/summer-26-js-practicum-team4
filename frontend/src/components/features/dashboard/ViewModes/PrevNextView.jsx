import React, { useContext } from "react";

// Component Imports
import PatternViewer from "../PatternDisplays/PatternViewer";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PrevNextView() {
  const { dispatch, dashActions, dashState } = useContext(DashContext);
  return (
    <div className="scroll-view flex mt-10 mx-10 gap-x-2">
      <button
        className="scroll-controller pb-20"
        onClick={() =>
          dispatch({ direction: "-", type: dashActions.setScrollPatternIx })
        }
      >
        <img
          className="w-30 opacity-85 hover:bg-gray-300"
          src="images/scroll-left.png"
        />
      </button>
      <PatternViewer pattern={dashState.patterns[dashState.scrollPatternIx]} />
      <button
        className="scroll-controller pb-20"
        onClick={() =>
          dispatch({ direction: "+", type: dashActions.setScrollPatternIx })
        }
      >
        <img
          className="w-30 opacity-85 hover:bg-gray-300"
          src="images/scroll-right.png"
        />
      </button>
    </div>
  );
}

export default PrevNextView;
