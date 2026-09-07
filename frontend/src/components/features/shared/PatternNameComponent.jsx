import React, { useState, useEffect, useRef } from "react";

import {
  validateNewPatternName,
  saveNewPatternName,
} from "../../../services/patternService";
import { useAuth } from "../../../state/auth/useAuth";
import { Pencil } from "lucide-react";

function PatternNameComponent({
  pattern,
  textStyle,
  setCurrentPatternName = "",
  showEditBtn = true,
  lockEdit = false,
}) {
  // Helpful States
  const { state, dispatch } = useAuth();
  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [localName, setLocalName] = useState("Pattern name?");
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
    if (state.isEditing || editingThisPattern || lockEdit) {
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
      return;
    }

    if (currentLocalPatternName.length > 30) {
      dispatch({
        type: "SET_ERROR",
        payload: "Pattern name exceeds 30 characters.",
      });
      return;
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
    dispatch({ type: "CLEAR_ERROR" });
  }

  // Component Definitions
  function editInterface() {
    return (
      <form onSubmit={handleSave}>
        <label htmlFor={patternId}></label>
        <div className="grid grid-cols-5 place-content-center gap-8">
          <input
            id={patternId}
            type="text"
            value={currentLocalPatternName}
            onChange={(event) => {
              setCurrentLocalPatternName(event.target.value);
            }}
            ref={editFocus}
            className={`${textStyle} bg-background rounded-md border border-gray-300 px-3 py-2 col-span-4 outline-none focus:border-gray-400`}
          ></input>
          <div className="flex items-center gap-3">
            <button
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white"
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
      <div className="flex gap-5">
        <h2 className={`${textStyle} justify-self-start`} onClick={handleEdit}>
          {pattern?.patternName ? pattern.patternName : currentLocalPatternName}
        </h2>
        {showEditBtn ? (
          <button
            type="button"
            className="px-2 py-3 text-secondary transition hover:text-primary"
            onClick={handleEdit}
            disabled={lockEdit}
          >
            <Pencil size={20} />
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  }

  return state.isEditing && editingThisPattern
    ? editInterface()
    : normalPageText();
}

export default PatternNameComponent;
