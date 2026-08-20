import React, { useState, useContext } from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";

import { DashContext } from "../../../../state/dashboard/dashContext";

function PatternViewerScroll({ pattern }) {
  // Import dashboard state, but also locally track pattern name editing
  const { dashState, dispatch, dashActions } = useContext(DashContext);
  const [currentPatternName, setCurrentPatternName] = useState(
    pattern.patternName,
  );

  function handleEdit() {
    if (dashState.isEditing) {
      return;
    }

    setCurrentPatternName(pattern.patternName);
    dispatch({ type: dashActions.beginEditing });

    return;
  }
  return (
    <>
      <div className="container mx-auto">
        {dashState.isEditing ? (
          <PatternNameEditInput
            patternId={pattern.id}
            defaultPatternName={pattern.patternName}
            currentPatternName={currentPatternName}
            setCurrentPatternName={setCurrentPatternName}
          />
        ) : (
          <div className="grid grid-cols-5 place-content-center">
            <h2 className="text-3xl mb-5">{pattern.patternName}</h2>
            <button className="col-start-6" onClick={handleEdit}>
              <img
                src="images/edit.png"
                className="hover:bg-gray-300 mb-5 w-10"
              />
            </button>
          </div>
        )}
        <div className="pattern-interface bg-white border rounded-2xl border-gray-400">
          <img
            className="mx-auto p-10 max-h-100 max-w-100"
            src={pattern.patternImgUrl}
            alt={pattern.patternName}
          />
        </div>
        <div className="flex justify-center gap-x-15 my-8">
          <DownloadPatternBtn pattern={pattern} />
          <DeletePatternBtn pattern={pattern} />
        </div>
      </div>
    </>
  );
}

export default PatternViewerScroll;
