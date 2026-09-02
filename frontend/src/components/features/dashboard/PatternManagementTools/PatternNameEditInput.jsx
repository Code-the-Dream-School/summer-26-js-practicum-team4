import React, { useContext } from "react";

// Import components
import { DashContext } from "../../../../state/dashboard/dashContext";
import { useAuth } from "../../../../state/auth/useAuth";

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
  const { dispatch } = useAuth();

  function handleCancel() {
    setCurrentPatternName(defaultPatternName);

    setEditingThisPattern(false);

    dispatch({ type: "END_PATTERN_NAME_EDITING" });
  }

  async function handleSave(event) {
    event.preventDefault();

    dispatch({ type: "BEGIN_PATTERN_NAME_SAVING" });
    await saveNewPatternName(patternId, currentPatternName);

    // if editing pattern in all patterns view
    if (setEditingThisPattern) {
      setEditingThisPattern(false);
    }

    dispatch({ type: "END_PATTERN_NAME_EDITING" });
    dispatch({ type: "END_PATTERN_NAME_SAVING" });
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
