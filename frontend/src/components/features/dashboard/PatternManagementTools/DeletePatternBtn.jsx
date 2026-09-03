import React, { useContext } from "react";

// Component Imports
import { DashGallContext } from "../../../../state/dashboardGallery/dashGallContext";

import { deleteUserPattern } from "../../../../services/patternService";

function DeletePatternBtn({ pattern }) {
  const { dispatch, dashGallState, dashGallActions } =
    useContext(DashGallContext);

  async function handleDelete() {
    dispatch({ type: dashGallActions.beginDelete });

    const deletedPattern = await deleteUserPattern(pattern.id);

    // End delete status when pattern successfully deleted
    dispatch({ type: dashGallActions.endDelete });

    return deletedPattern;
  }

  // Customize button icon according to display
  if (dashGallState.view === "scroll") {
    return (
      <button
        onClick={handleDelete}
        className="bg-primary text-white px-10 py-2 border border-black rounded-md hover:bg-accent"
      >
        Delete
      </button>
    );
  } else if (dashGallState.view === "all") {
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
