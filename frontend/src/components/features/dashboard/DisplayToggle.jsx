import React from "react";
import PropTypes from "prop-types";

function DisplayToggle({ onClick, displayImagePath }) {
  // view determines pattern layout (i.e. full dashboard vs. scroll), iconImgUrl determines the image for icon
  return (
    <div>
      <button onClick={onClick}>
        <img className="m-2 size-12 hover:bg-gray-200" src={displayImagePath} />
      </button>
    </div>
  );
}

DisplayToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
  displayImagePath: PropTypes.string.isRequired,
};

export default DisplayToggle;
