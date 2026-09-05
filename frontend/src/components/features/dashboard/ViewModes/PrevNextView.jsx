import React, { useContext } from "react";
import PropTypes from "prop-types";

// Component Imports
import PatternViewerScroll from "../PatternDisplays/PatternViewerScroll";
import PatternScrollBtn from "../PatternManagementTools/PatternScrollBtn";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PrevNextView({ setPatternToPrint, canvasRef }) {
  const { dashState } = useContext(DashContext);
  return (
    <div className="scroll-view grid grid-cols-[7%_86%_7%] place-items-center mt-10 mx-10 gap-x-2">
      <PatternScrollBtn imgSrc="images/scroll-left.png" direction="-" />
      <PatternViewerScroll
        pattern={dashState.patterns[dashState.scrollPatternIx]}
        page={dashState.page}
        setPatternToPrint={setPatternToPrint}
        canvasRef={canvasRef}
      />
      <PatternScrollBtn imgSrc="images/scroll-right.png" direction="+" />
    </div>
  );
}

PrevNextView.propTypes = {
  setPatternToPrint: PropTypes.func,
  canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default PrevNextView;
