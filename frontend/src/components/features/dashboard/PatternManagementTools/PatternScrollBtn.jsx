import React, { useContext } from "react";
import { DashGallContext } from "../../../../state/dashboardGallery/dashGallContext";

function PatternScrollBtn({ imgSrc, direction }) {
  const { dispatch, dashGallActions } = useContext(DashGallContext);

  return (
    <button
      className="scroll-controller pb-20"
      onClick={() =>
        dispatch({
          direction: direction,
          type: dashGallActions.setScrollPatternIx,
        })
      }
    >
      <img className="opacity-85 hover:bg-gray-300" src={imgSrc} />
    </button>
  );
}

export default PatternScrollBtn;
