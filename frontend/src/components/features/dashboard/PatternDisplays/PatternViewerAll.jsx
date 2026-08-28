import React, { useState, useContext } from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";

import { DashContext } from "../../../../state/dashboard/dashContext";

function getDate(dateTimeStr) {
  return dateTimeStr.split("T")[0];
}

function PatternViewerAll({ pattern }) {
  const { dashState, dashActions, dispatch } = useContext(DashContext);
  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [currentPatternName, setCurrentPatternName] = useState(
    pattern.patternName,
  );

  function handleEdit() {
    if (dashState.isEditing) {
      return;
    }

    setCurrentPatternName(pattern.patternName);
    setEditingThisPattern(true);

    dispatch({ type: dashActions.beginEditing });

    return;
  }

  function patternEditInterface() {
    if (dashState.isEditing && editingThisPattern) {
      return (
        <PatternNameEditInput
          patternId={pattern.id}
          defaultPatternName={pattern.patternName}
          currentPatternName={currentPatternName}
          setCurrentPatternName={setCurrentPatternName}
          setEditingThisPattern={setEditingThisPattern}
          textStyle="text-2xl ml-5"
        />
      );
    } else {
      return (
        <div className="grid grid-cols-5 place-content-center">
          <h2 className="text-2xl ml-5">{pattern.patternName}</h2>
          <button className="col-start-6" onClick={handleEdit}>
            <img
              src="images/edit.png"
              className="hover:bg-gray-300 mb-5 w-10"
            />
          </button>
        </div>
      );
    }
  }
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
        {patternEditInterface()}

        <h3 className="mb-10 ml-5">Created {getDate(pattern.createdAt)}</h3>
      </div>
    </>
  );
}

export default PatternViewerAll;
