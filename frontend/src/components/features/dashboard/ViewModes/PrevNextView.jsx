import React, { useContext } from "react";

// Component Imports
import PatternViewer from "../PatternDisplays/PatternViewer";
import PatternScrollBtn from "../PatternManagementTools/PatternScrollBtn";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PrevNextView() {
  const { dashState } = useContext(DashContext);
  return (
    <div className="scroll-view grid grid-cols-[7%_86%_7%] place-items-center mt-10 mx-10 gap-x-2">
      <PatternScrollBtn imgSrc="images/scroll-left.png" direction="-" />
      <PatternViewer
        pattern={dashState.patterns[dashState.scrollPatternIx]}
        view="scroll"
      />
      <PatternScrollBtn imgSrc="images/scroll-right.png" direction="+" />
    </div>
  );
}

export default PrevNextView;
