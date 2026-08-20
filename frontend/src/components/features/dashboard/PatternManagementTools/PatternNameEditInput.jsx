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
      <input
        id={patternId}
        type="text"
        value={currentPatternName}
        onChange={() => {
          setCurrentPatternName(event.target.value);
        }}
      ></input>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

export default PatternNameEditInput;
