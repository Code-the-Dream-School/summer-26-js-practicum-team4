import React from "react";

import { useAuth } from "../../../state/auth/useAuth";
import { saveNewPattern } from "../../../services/patternService";

function SavePatternBtn({ pattern, textStyle }) {
  // States
  const { dispatch } = useAuth();

  async function savePattern() {
    const savedPattern = await saveNewPattern(pattern);

    if (savedPattern?.error?.message) {
      dispatch({
        type: "SET_ERROR",
        payload: savedPattern.error.message,
      });
    }
  }
  return (
    <button onClick={savePattern} className={textStyle}>
      Save Pattern
    </button>
  );
}

export default SavePatternBtn;
