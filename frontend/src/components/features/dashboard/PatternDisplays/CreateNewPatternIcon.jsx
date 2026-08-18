import React from "react";
import { Link } from "react-router-dom";

function CreateNewPatternIcon() {
  return (
    <>
      <div>
        <div className="m-2 bg-white border rounded-2xl border-gray-400">
          <Link to="/generate">
            <img
              src="images/new-project-icon.png"
              className="mx-auto p-5 object-contain w-70"
            />
          </Link>
        </div>
        <h3></h3>
      </div>
    </>
  );
}

export default CreateNewPatternIcon;
