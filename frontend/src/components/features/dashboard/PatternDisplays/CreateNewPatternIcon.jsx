import React from "react";
import { Link } from "react-router-dom";

function CreateNewPatternIcon() {
  return (
    <>
      <Link to="/generate">
        <img
          src="./../../../../../images/add-pattern-icon.png"
          width={200}
          height={200}
        />
      </Link>
    </>
  );
}

export default CreateNewPatternIcon;
