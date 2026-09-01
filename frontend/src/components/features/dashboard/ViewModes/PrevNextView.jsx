import React, { useContext } from "react";

// Component Imports
import PatternViewerScroll from "../../shared/PatternDisplays/PatternViewerScroll";
import PatternScrollBtn from "../PatternManagementTools/PatternScrollBtn";
import { DashGallContext } from "../../../../state/dashboardGallery/dashGallContext";

function PrevNextView() {
  const { dashGallState } = useContext(DashGallContext);
  return (
    <div className="scroll-view grid grid-cols-[7%_86%_7%] place-items-center mt-10 mx-10 gap-x-2">
      <PatternScrollBtn imgSrc="images/scroll-left.png" direction="-" />
      <PatternViewerScroll
        pattern={dashGallState.patterns[dashGallState.scrollPatternIx]}
        page="dashboard"
      />
      <PatternScrollBtn imgSrc="images/scroll-right.png" direction="+" />
    </div>
  );
}

export default PrevNextView;
