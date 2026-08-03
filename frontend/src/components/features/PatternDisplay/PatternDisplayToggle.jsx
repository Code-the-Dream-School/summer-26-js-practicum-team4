import React from "react";

function PatternDisplayToggle({ name, onClick }) {
  // view determines pattern layout (i.e. full dashboard vs. scroll), iconImgUrl determines the image for icon
  return (
    <div>
      <button onClick={onClick}>{name}</button>
    </div>
  );
}

export default PatternDisplayToggle;
