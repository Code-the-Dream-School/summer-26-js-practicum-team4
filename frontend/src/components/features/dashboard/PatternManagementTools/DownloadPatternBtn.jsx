import React, { useContext } from "react";

import { DashContext } from "../../../../state/dashboard/dashContext";
import PatternCanvas from "../../pattern/PatternCanvas";

function DownloadPatternBtn({ pattern, origin }) {
  const { dashState } = useContext(DashContext);

  function downloadLink(origin) {
    // Convert pattern into canvas, save as png, and generate URL to download
    if (origin === "dashboard") {
      const patternCanvasInstance = (
        <PatternCanvas pattern={pattern} cellSize={8} />
      );
    } else if (origin === "generate") {
      return 5;
    }
    let link = 5;
  }

  return (
    <>
      <a href={pattern.patternImgUrl} target="_blank" rel="noreferrer" download>
        {dashState.view === "scroll" ? (
          <button className="bg-primary text-white px-10 py-2 border border-black rounded-md hover:bg-accent">
            Download
          </button>
        ) : (
          <button>
            <img
              src="images/all-pattern-download.png"
              className="max-w-10 hover:bg-gray-300"
            />
          </button>
        )}
      </a>
    </>
  );
}

export default DownloadPatternBtn;
