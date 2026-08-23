import React, { useContext } from "react";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PatternScrollBtn({ imgSrc, direction }) {
  const { dispatch, dashActions } = useContext(DashContext);

  return (
    <button
      className="scroll-controller pb-20"
      onClick={() =>
        dispatch({
          direction: direction,
          type: dashActions.setScrollPatternIx,
        })
      }
    >
      <img className="opacity-85 hover:bg-gray-300" src={imgSrc} />
    </button>
  );
}

export default PatternScrollBtn;
