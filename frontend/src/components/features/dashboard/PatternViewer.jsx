import React, { useContext } from "react";

// Component Imports
import { DashContext } from "../../../state/dashboard/dashContext";

import DownloadPatternBtn from "./DownloadPatternBtn";
import DeletePatternBtn from "./DeletePatternBtn";

function PatternViewer({ pattern }) {
  const { dashState, dashActions, dispatch } = useContext(DashContext);
  return (
    <>
      <img src={pattern.patternImgUrl} height={200} width={200} />
      <DownloadPatternBtn pattern={pattern} />
      <DeletePatternBtn pattern={pattern} />
    </>
  );
}

export default PatternViewer;
