import React, { useContext } from "react";

// Component Imports
import { DashContext } from "../../../../state/dashboard/dashContext";

import { deleteUserPattern } from "../../../../services/patternService";

function DeletePatternBtn({ pattern }) {
  const { dispatch, dashState, dashActions } = useContext(DashContext);

  async function handleDelete() {
    dispatch({ type: dashActions.beginDelete });

    const deletedPattern = await deleteUserPattern(pattern.id);

    // End delete status when pattern successfully deleted
    dispatch({ type: dashActions.endDelete });

    return deletedPattern;
  }

  // Customize button icon according to display
  if (dashState.view === "scroll") {
    return (
      <button
        onClick={handleDelete}
        className="bg-primary text-white px-10 py-2 border border-black rounded-md hover:bg-accent"
      >
        Delete
      </button>
    );
  } else if (dashState.view === "all") {
    return <h1>Huye</h1>;
  }
}

export default DeletePatternBtn;
