import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function DashEdit({ pattern }) {
  return (
    <Link to={`/edit/${pattern.id}`}>
      <button>
        {" "}
        <img
          src="images/dashEdit.png"
          className="hover:bg-gray-300 mt-1 w-10"
        />
      </button>
    </Link>
  );
}

DashEdit.propTypes = {
  pattern: PropTypes.shape({
    id: PropTypes.number.isRequired,
    patternName: PropTypes.string.isRequired,
    stitchWidth: PropTypes.number.isRequired,
    stitchHeight: PropTypes.number.isRequired,
    palette: PropTypes.arrayOf(
      PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    grid: PropTypes.arrayOf(PropTypes.number).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default DashEdit;
