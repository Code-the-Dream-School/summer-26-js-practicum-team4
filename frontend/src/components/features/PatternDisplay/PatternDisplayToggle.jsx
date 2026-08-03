import React from "react";

function PatternDisplayToggle({ name }) {
  // view determines pattern layout (i.e. full dashboard vs. scroll), iconImgUrl determines the image for icon
  return (
    <div>
      <button>{name}</button>
    </div>
  );
}

export default PatternDisplayToggle;
