import React, { useContext } from "react";

import { DashContext } from "../../../../state/dashboard/dashContext";

function DownloadPatternBtn({ pattern }) {
  const { dashState } = useContext(DashContext);

  return (
    <>
      <a href={pattern.patternImgUrl} target="_blank" rel="noreferrer" download>
        {dashState.view === "scroll" ? (
          <button className="bg-primary text-white px-10 py-2 border border-black rounded-md hover:bg-accent">
            Download
          </button>
        ) : (
          <h1>Naye</h1>
        )}
      </a>
    </>
  );
}

export default DownloadPatternBtn;
