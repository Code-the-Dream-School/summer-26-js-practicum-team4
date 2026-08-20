import React, { useContext } from "react";

// Import components
import { DashContext } from "../../../../state/dashboard/dashContext";

import { saveNewPatternName } from "../../../../services/patternService";

function PatternNameEditInput({
  patternId,
  defaultPatternName,
  currentPatternName,
  setCurrentPatternName,
}) {
  const { dispatch, dashActions, dashState } = useContext(DashContext);

  function handleCancel() {
    setCurrentPatternName(defaultPatternName);

    dispatch({ type: dashActions.endEditing });
  }

  async function handleSave() {
    dispatch({ type: dashActions.beginSaving });

    await saveNewPatternName(patternId, currentPatternName);

    dispatch({ type: dashActions.endEditing });
    dispatch({ type: dashActions.endSaving });
  }
  return (
    <div>
      <label htmlFor={patternId}></label>
      <div className="grid grid-cols-5 place-content-center">
        <input
          id={patternId}
          type="text"
          value={currentPatternName}
          onChange={() => {
            setCurrentPatternName(event.target.value);
          }}
          className="text-3xl bg-white rounded-xl p-1 border mb-5"
        ></input>
        <button
          className="col-start-5 col-span-1 bg-primary hover:bg-accent text-white border border-black rounded-md ml-auto"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="col-start-6 col-span-1 bg-primary hover:bg-accent text-white border border-black rounded-md m-auto"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PatternNameEditInput;
