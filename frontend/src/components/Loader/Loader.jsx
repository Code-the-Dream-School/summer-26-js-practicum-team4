import React from "react";
import PropTypes from "prop-types";
import "./Loader.css";
import { SpinnerDiamond } from "spinners-react";

function Loader({
  size = 100,
  thickness = 100,
  speed = 60,
  color = "black",
  secondaryColor = "gray",
}) {
  return (
    <div className="loader">
      <SpinnerDiamond
        size={size}
        thickness={thickness}
        speed={speed}
        color={color}
        secondaryColor={secondaryColor}
      />
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
  speed: PropTypes.number,
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
};

export default Loader;
