async function getCurrentUserPatterns() {
  const resp = await fetch("/api/patterns/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }); // workshop how to send httponly cookie

  if (!resp.ok) {
    throw new Error(resp.message);
  }

  const { data } = await resp.json();
  return data.patterns;
}

async function getAllUserPatterns() {
  // to be implemented later when implementing Gallery Page
  return;
}

export default { getCurrentUserPatterns, getAllUserPatterns };
