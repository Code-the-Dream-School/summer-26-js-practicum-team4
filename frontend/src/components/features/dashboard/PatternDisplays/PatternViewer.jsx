import React, { useContext } from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementBtns/DeletePatternBtn";
import { DashContext } from "../../../../state/dashboard/dashContext";

function PatternViewer({ pattern }) {
  const { dashState } = useContext(DashContext);

  function downloadDeleteBtnsRenderLocation(displayState) {
    if (dashState.view === displayState) {
      let className = "";

      // Position buttons below and in the middle if in scroll view.
      // Else, place in top right of pattern container
      if (displayState === "scroll") {
        className = "flex justify-center gap-x-15 my-8";
      } else {
        className = "";
      }
      return (
        <>
          <div className={className}>
            <DownloadPatternBtn pattern={pattern} />
            <DeletePatternBtn pattern={pattern} />
          </div>
        </>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <h2 className="text-3xl mb-5">{pattern.patternName}</h2>
        <div className="pattern-interface bg-white border rounded-2xl border-gray-400">
          {downloadDeleteBtnsRenderLocation("all")}
          <img
            className="mx-auto pt-10 pb-10"
            src={pattern.patternImgUrl}
            height={200}
            width={200}
          />
        </div>
        {downloadDeleteBtnsRenderLocation("scroll")}
      </div>
    </>
  );
}

export default PatternViewer;
