import React from "react";
import PropTypes from "prop-types";

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

SavePatternBtn.propTypes = {
  pattern: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    palette: PropTypes.arrayOf(
      PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    grid: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  textStyle: PropTypes.string,
};

export default SavePatternBtn;
