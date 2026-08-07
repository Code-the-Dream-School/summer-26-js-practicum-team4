import React from "react";

// Component Imports
import { deleteUserPattern } from "../../../services/patternService";

function DeletePatternBtn({ pattern }) {
  async function handleDelete() {
    const deletedPattern = await deleteUserPattern(pattern.id);
    return;
  }
  return <button onClick={handleDelete}>Delete</button>;
}

export default DeletePatternBtn;
