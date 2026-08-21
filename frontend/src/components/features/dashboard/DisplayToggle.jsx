import React from "react";

function DisplayToggle({ name, onClick, displayImagePath }) {
  // view determines pattern layout (i.e. full dashboard vs. scroll), iconImgUrl determines the image for icon
  return (
    <div>
      <button onClick={onClick}>
        <img className="m-2 size-12 hover:bg-gray-200" src={displayImagePath} />
      </button>
    </div>
  );
}

export default DisplayToggle;
