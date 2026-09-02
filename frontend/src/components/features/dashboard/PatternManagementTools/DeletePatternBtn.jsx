import React, { useContext } from "react";

// Component Imports
import { DashContext } from "../../../../state/dashboard/dashContext";
import { useAuth } from "../../../../state/auth/useAuth";

import { deleteUserPattern } from "../../../../services/patternService";

function DeletePatternBtn({ pattern }) {
  const { dashState } = useContext(DashContext);
  const { dispatch } = useAuth();

  async function handleDelete() {
    dispatch({ type: "BEGIN_PATTERN_DELETING" });

    const deletedPattern = await deleteUserPattern(pattern.id);

    // End delete status when pattern successfully deleted
    dispatch({ type: "END_PATTERN_DELETING" });

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
    return (
      <button onClick={handleDelete}>
        <img
          src="images/all-pattern-delete.png"
          className="max-w-10 hover:bg-gray-300"
        />
      </button>
    );
  }
}

export default DeletePatternBtn;
