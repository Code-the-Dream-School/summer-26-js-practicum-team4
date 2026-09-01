import React, { useContext } from "react";

// Import components
import { DashGallContext } from "../../../../state/dashboardGallery/dashGallContext";

import { saveNewPatternName } from "../../../../services/patternService";

function PatternNameEditInput({
  patternId,
  defaultPatternName,
  currentPatternName,
  setCurrentPatternName,
  textStyle,
  ref,
  setEditingThisPattern,
}) {
  const { dispatch, dashGallActions } = useContext(DashGallContext);

  function handleCancel() {
    setCurrentPatternName(defaultPatternName);

    setEditingThisPattern(false);

    dispatch({ type: dashGallActions.endEditing });
  }

  async function handleSave(event) {
    event.preventDefault();

    dispatch({ type: dashGallActions.beginSaving });
    await saveNewPatternName(patternId, currentPatternName);

    // if editing pattern in all patterns view
    if (setEditingThisPattern) {
      setEditingThisPattern(false);
    }

    dispatch({ type: dashGallActions.endEditing });
    dispatch({ type: dashGallActions.endSaving });
  }
  return (
    <div>
      <form onSubmit={handleSave}>
        <label htmlFor={patternId}></label>
        <div className="grid grid-cols-5 place-content-center">
          <input
            id={patternId}
            type="text"
            value={currentPatternName}
            onChange={(event) => {
              setCurrentPatternName(event.target.value);
            }}
            ref={ref}
            className={`${textStyle} bg-white rounded-xl p-1 border mb-5 col-span-4`}
          ></input>
          <div className="col-start-6">
            <button
              className=" bg-primary hover:bg-accent text-white border border-black rounded-md m-auto mr-1 p-1"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className=" bg-primary hover:bg-accent text-white border border-black rounded-md m-auto p-1"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PatternNameEditInput;
