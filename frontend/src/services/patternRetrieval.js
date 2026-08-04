async function fetchCurrentUserPatterns() {
  try {
    const resp = await fetch("http://localhost:8080/api/patterns/", {
      // temporarily specifying localhost url until relative url access is implemented
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
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

async function fetchAllUserPatterns() {
  // to be implemented later when implementing Gallery Page
  return;
}

export { fetchCurrentUserPatterns, fetchAllUserPatterns };
