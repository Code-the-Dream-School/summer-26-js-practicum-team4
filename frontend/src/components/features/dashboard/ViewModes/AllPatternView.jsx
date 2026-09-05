import React, { useContext } from "react";
import PropTypes from "prop-types";

import PatternViewerAll from "../PatternDisplays/PatternViewerAll";
import CreateNewPatternIcon from "../PatternDisplays/CreateNewPatternIcon";
import { DashContext } from "../../../../state/dashboard/dashContext";

function AllPatternView({ setPatternToPrint, canvasRef }) {
  const { dashState } = useContext(DashContext);
  return (
    <>
      <div className="all-pattern-view mx-20 mt-10 pb-20 grid grid-cols-3">
        {dashState.patterns.map((pattern) => (
          <PatternViewerAll
            key={pattern.id}
            pattern={pattern}
            page={dashState.page}
            setPatternToPrint={setPatternToPrint}
            canvasRef={canvasRef}
          />
        ))}
        <CreateNewPatternIcon patternDisplayScaling="h-[45dvh]" />
      </div>
    </>
  );
}

AllPatternView.propTypes = {
  setPatternToPrint: PropTypes.func,
  canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default AllPatternView;
