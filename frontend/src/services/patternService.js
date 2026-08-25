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

async function fetchAllUserPatterns() {
  try {
    const resp = await fetch("/api/patterns/all", {
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

async function saveNewPatternName(patternId, newPatternName) {
  try {
    const resp = await fetch(`/api/patterns/${patternId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        patternName: newPatternName,
      }),
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

async function generatePattern({ image, width = 50, height = 50 }) {
  const formData = new FormData();

  formData.append("image", image);
  formData.append("width", String(width));
  formData.append("height", String(height));

  const response = await fetch("/api/patterns/generate", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    let message = "Unable to generate the pattern.";

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      message = errorData.message || message;
    }

    throw new Error(message);
  }

  return response.blob();
}

export {
  fetchCurrentUserPatterns,
  fetchAllUserPatterns,
  deleteUserPattern,
  saveNewPatternName,
  generatePattern,
};
