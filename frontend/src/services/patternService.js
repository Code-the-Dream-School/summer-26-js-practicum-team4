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
      throw new Error("The server returned an invalid response.");
    }

    const { data } = await resp.json();

    // For each retrieved pattern, recast stitchWidth and stitchHeight as width and height
    // for compatibility with Pattern Generation code
    const reformattedPatterns = [];
    for (const pattern of data.patterns) {
      reformattedPatterns.push({
        ...pattern,
        width: pattern.stitchWidth,
        height: pattern.stitchHeight,
      });
    }
    return reformattedPatterns;
  } catch (error) {
    console.error(error.message);
    return { message: `Error: ${error.message}` };
  }
}

async function fetchAllUserPatterns() {
  return { message: "This function has been discontinued." };
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
      throw new Error("The server returned an invalid response.");
    }

    const { data } = await resp.json();
    return data.pattern;
  } catch (error) {
    console.error(error.message);
    return { message: `Error: ${error.message}` };
  }
}

async function saveNewPattern(patternObj) {
  try {
    const resp = await fetch(`/api/patterns/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(patternObj),
    });

    if (!resp.ok) {
      throw new Error("The server returned an invalid response.");
    }

    const { data } = await resp.json();
    return data.pattern;
  } catch (error) {
    console.error(error.message);
    return { message: `Error: ${error.message}` };
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
      throw new Error("The server returned an invalid response.");
    }

    const { data } = await resp.json();
    return data.pattern;
  } catch (error) {
    console.error(error.message);
    return { message: `Error: ${error.message}` };
  }
}

async function generatePattern({ image, width, height }) {
  const hasWidth = width !== undefined && width !== null;
  const hasHeight = height !== undefined && height !== null;

  if (hasWidth === hasHeight) {
    throw new Error("Provide exactly one pattern dimension.");
  }

  const formData = new FormData();

  formData.append("image", image);

  if (hasWidth) {
    formData.append("width", String(width));
  } else {
    formData.append("height", String(height));
  }

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

  let responseData;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("The server returned an invalid pattern.");
  }

  const pattern = responseData?.data?.pattern;

  if (
    !Number.isInteger(pattern?.width) ||
    pattern.width <= 0 ||
    !Number.isInteger(pattern?.height) ||
    pattern.height <= 0 ||
    !Array.isArray(pattern?.palette) ||
    pattern.palette.length === 0 ||
    !pattern.palette.every(
      (color) =>
        typeof color?.dmcCode === "string" &&
        typeof color?.name === "string" &&
        typeof color?.symbol === "string" &&
        [color.r, color.g, color.b].every(Number.isInteger),
    ) ||
    !Array.isArray(pattern?.grid) ||
    pattern.grid.length !== pattern.width * pattern.height ||
    !pattern.grid.every(
      (paletteIndex) =>
        Number.isInteger(paletteIndex) &&
        paletteIndex >= 0 &&
        paletteIndex < pattern.palette.length,
    )
  ) {
    throw new Error("The server returned an invalid pattern.");
  }

  return pattern;
}

export {
  fetchCurrentUserPatterns,
  fetchAllUserPatterns,
  deleteUserPattern,
  saveNewPattern,
  saveNewPatternName,
  generatePattern,
};
