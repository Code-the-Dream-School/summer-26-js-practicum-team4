import React, { useContext } from "react";

import { DashGallContext } from "../../../../state/dashboardGallery/dashGallContext";

function DownloadPatternBtn({ pattern }) {
  const { dashGallState } = useContext(DashGallContext);

  return (
    <>
      <a href={pattern.patternImgUrl} target="_blank" rel="noreferrer" download>
        {dashGallState.view === "scroll" ? (
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
