import React, { useContext } from "react";

import { DashContext } from "../../../../state/dashboard/dashContext";
import PatternCanvas from "../../pattern/PatternCanvas";

function DownloadPatternBtn({ pattern, canvasRef }) {
  const { dashState } = useContext(DashContext);

  async function downloadLink() {
    // Convert pattern into canvas, save as png, and generate URL to download
    if (!canvasRef) {
      const patternCanvasInstance = (
        <PatternCanvas pattern={pattern} cellSize={8} canvasRef={canvasRef} />
      );

      // let patternImgUrl = "";
      // await patternCanvasInstance.toBlob((blob) => {
      //   patternImgUrl = URL.createObjectURL(blob);
      // }, "image/png");
      // return patternImgUrl;
    } else {
      return "Not implemented yet.";
    }
  }

  return (
    <>
      <a href={"345"} target="_blank" rel="noreferrer" download>
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
