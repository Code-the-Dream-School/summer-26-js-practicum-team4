import React from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementBtns/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementBtns/DeletePatternBtn";

function getDate(dateTimeStr) {
  return dateTimeStr.split("T")[0];
}

function PatternViewerAll({ pattern }) {
  return (
    <>
      <div>
        <div className="pattern-interface bg-white border rounded-2xl border-gray-400 m-2">
          <div className="download-and-delete-buttons text-right mr-2 mt-2">
            <DownloadPatternBtn pattern={pattern} />
            <DeletePatternBtn pattern={pattern} />
          </div>
          <img
            className="mx-auto p-5 object-contain"
            src={pattern.patternImgUrl}
            alt={pattern.patternName}
          />
        </div>
        <h2 className="text-2xl ml-5">{pattern.patternName}</h2>
        <h3 className="mb-10 ml-5">Created {getDate(pattern.createdAt)}</h3>
      </div>
    </>
  );
}

export default PatternViewerAll;
