import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function CreateNewPatternIcon({ patternDisplayScaling = "" }) {
  return (
    <>
      <div>
        <div
          className={`container grid place-content-center m-2 bg-white border rounded-2xl border-gray-400 ${patternDisplayScaling}`}
        >
          <Link to="/generate">
            <img
              src="images/new-project-icon.png"
              className="p-5 object-contain w-70"
              alt="create new pattern"
            />
          </Link>
        </div>
        <h3></h3>
      </div>
    </>
  );
}

CreateNewPatternIcon.propTypes = {
  patternDisplayScaling: PropTypes.string,
};

export default CreateNewPatternIcon;
