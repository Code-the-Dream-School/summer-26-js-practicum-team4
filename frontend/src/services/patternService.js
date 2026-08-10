async function fetchCurrentUserPatterns() {
  try {
    const resp = await fetch("/api/patterns/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error(resp.message);
    }

    const { data } = await resp.json();
    return data.patterns;
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteUserPattern(patternId) {
  try {
    const resp = await fetch(`/api/patterns/${patternId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!resp.ok) {
      throw new Error(resp.message);
    }

    const { data } = await resp.json();
    return data.pattern;
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchAllUserPatterns() {
  // to be implemented later when implementing Gallery Page
  return;
}

export { fetchCurrentUserPatterns, deleteUserPattern, fetchAllUserPatterns };
