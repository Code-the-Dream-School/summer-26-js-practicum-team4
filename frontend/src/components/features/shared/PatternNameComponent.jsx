import React, { useState, useEffect, useRef } from "react";

import {
  validateNewPatternName,
  saveNewPatternName,
} from "../../../services/patternService";
import { useAuth } from "../../../state/auth/useAuth";

function PatternNameComponent({
  pattern,
  textStyle,
  setCurrentPatternName = "",
}) {
  // Helpful States
  const { state, dispatch } = useAuth();
  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [localName, setLocalName] = useState("Would you like to set a name?");
  const [currentLocalPatternName, setCurrentLocalPatternName] = useState(
    pattern?.patternName ? pattern.patternName : localName,
  );

  // Refs
  const editFocus = useRef("");

  // Patterns called from generatePattern page get latter id
  const patternId = pattern?.id ? pattern.id : 99999;

  // Focus on editing field if useRef has a non-empty reference
  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [state.isEditing, editingThisPattern]);

  // Helper functions
  function handleEdit() {
    if (state.isEditing || editingThisPattern) {
      return;
    }

    // Called from dashboard, name in db
    if (pattern?.patternName) {
      setCurrentLocalPatternName(pattern.patternName);
      // Called from generatePage, only local name
    } else {
      setCurrentLocalPatternName(localName);
    }

    setEditingThisPattern(true);
    dispatch({ type: "BEGIN_PATTERN_NAME_EDITING" });

    return;
  }

  function handleCancel() {
    if (pattern?.patternName) {
      setCurrentLocalPatternName(pattern.patternName);
    } else {
      setCurrentLocalPatternName(localName);
    }

    setEditingThisPattern(false);

    dispatch({ type: "END_PATTERN_NAME_EDITING" });
  }

  async function handleSave(event) {
    event.preventDefault();

    dispatch({ type: "BEGIN_PATTERN_NAME_SAVING" });

    if (!validateNewPatternName(currentLocalPatternName)) {
      // invalid pattern name, end saving
      dispatch({ type: "END_PATTERN_NAME_SAVING" });
    }

    // Pattern on generatePage saves name locally
    if (patternId === 99999) {
      setLocalName(currentLocalPatternName);

      if (setCurrentPatternName) {
        setCurrentPatternName(currentLocalPatternName);
      }
    }

    // dashboard patterns save name to db
    else {
      const newPatName = await saveNewPatternName(
        patternId,
        currentLocalPatternName,
      );

      if (newPatName?.error?.message) {
        dispatch({ type: "SET_ERROR", payload: newPatName.error.message });
      }
    }

    setCurrentLocalPatternName(currentLocalPatternName);
    setEditingThisPattern(false);
    dispatch({ type: "END_PATTERN_NAME_EDITING" });
    dispatch({ type: "END_PATTERN_NAME_SAVING" });
  }

  // Component Definitions
  function editInterface() {
    return (
      <form onSubmit={handleSave}>
        <label htmlFor={patternId}></label>
        <div className="grid grid-cols-5 place-content-center">
          <input
            id={patternId}
            type="text"
            value={currentLocalPatternName}
            onChange={(event) => {
              setCurrentLocalPatternName(event.target.value);
            }}
            ref={editFocus}
            className={`${textStyle} bg-white rounded-xl p-1 border mb-5 col-span-5`}
          ></input>
          <div className="col-start-6 mt-1">
            <button
              className=" bg-primary hover:bg-accent text-white border border-black rounded-md m-auto mr-1 ml-4 p-1"
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
    );
  }

  function normalPageText() {
    return (
      <div className="grid grid-cols-5 place-content-center">
        <h2 className={textStyle}>
          {pattern?.patternName ? pattern.patternName : currentLocalPatternName}
        </h2>
        <button className="col-start-6" onClick={handleEdit}>
          <img src="images/edit.png" className="hover:bg-gray-300 mb-5 w-10" />
        </button>
      </div>
    );
  }

  return state.isEditing && editingThisPattern
    ? editInterface()
    : normalPageText();
}

export default PatternNameComponent;
