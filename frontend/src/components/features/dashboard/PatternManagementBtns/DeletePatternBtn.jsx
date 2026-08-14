import React, { useContext } from "react";

// Component Imports
import { DashContext } from "../../../state/dashboard/dashContext";

import { deleteUserPattern } from "../../../services/patternService";

function DeletePatternBtn({ pattern }) {
  const { dispatch, dashActions } = useContext(DashContext);

  async function handleDelete() {
    dispatch({ type: dashActions.beginDelete });

    const deletedPattern = await deleteUserPattern(pattern.id);

    // End delete status when pattern successfully deleted
    dispatch({ type: dashActions.endDelete });

    return deletedPattern;
  }
  return <button onClick={handleDelete}>Delete</button>;
}

export default DeletePatternBtn;
