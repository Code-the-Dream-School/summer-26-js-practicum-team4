import React from "react";
import PropTypes from "prop-types";

// Import components
import { useAuth } from "../../../state/auth/useAuth";

import {
  saveNewPatternName,
  validateNewPatternName,
} from "../../../services/patternService";

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

    if (!validateNewPatternName(currentPatternName)) {
      // invalid pattern name, end saving
      dispatch({ type: "END_PATTERN_NAME_SAVING" });
    }

    // patternId can be null if triggered from newly generated pattern page
    if (patternId) {
      await saveNewPatternName(patternId, currentPatternName);
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

PatternNameEditInput.propTypes = {
  patternId: PropTypes.string.isRequired,
  defaultPatternName: PropTypes.string.isRequired,
  currentPatternName: PropTypes.string.isRequired,
  setCurrentPatternName: PropTypes.func.isRequired,
  textStyle: PropTypes.string.isRequired,
  ref: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  setEditingThisPattern: PropTypes.func.isRequired,
};

export default PatternNameEditInput;
