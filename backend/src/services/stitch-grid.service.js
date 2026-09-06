function isDmcColor(color) {
  return (
    typeof color?.dmcCode === "string" &&
    color.dmcCode.length > 0 &&
    typeof color.name === "string" &&
    color.name.length > 0 &&
    [color.r, color.g, color.b].every(
      (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
    )
  );
}

function validateDmcPattern(dmcPattern) {
  if (
    !Number.isInteger(dmcPattern?.width) ||
    dmcPattern.width <= 0 ||
    !Number.isInteger(dmcPattern?.height) ||
    dmcPattern.height <= 0 ||
    !Array.isArray(dmcPattern?.palette) ||
    dmcPattern.palette.length === 0 ||
    !dmcPattern.palette.every(isDmcColor) ||
    !Array.isArray(dmcPattern?.colorIndexes) ||
    dmcPattern.colorIndexes.length !== dmcPattern.width * dmcPattern.height ||
    !dmcPattern.colorIndexes.every(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < dmcPattern.palette.length,
    )
  ) {
    throw new Error("A valid DMC pattern is required.");
  }
}

function generateStitchGrid(dmcPattern) {
  validateDmcPattern(dmcPattern);

  return {
    width: dmcPattern.width,
    height: dmcPattern.height,
    palette: dmcPattern.palette.map((color) => ({ ...color })),
    grid: [...dmcPattern.colorIndexes],
  };
}

function resizeStitchGrid(
  grid,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
) {
  if (
    !Array.isArray(grid) ||
    grid.length !== oldWidth * oldHeight
  ) {
    throw new Error("A valid stitch grid is required.");
  }

  const resizedGrid = [];

  for (let row = 0; row < newHeight; row += 1) {
    const sourceRow = Math.min(
      oldHeight - 1,
      Math.floor((row * oldHeight) / newHeight),
    );

    for (let column = 0; column < newWidth; column += 1) {
      const sourceColumn = Math.min(
        oldWidth - 1,
        Math.floor((column * oldWidth) / newWidth),
      );

      const sourceIndex = sourceRow * oldWidth + sourceColumn;

      resizedGrid.push(grid[sourceIndex]);
    }
  }

  return resizedGrid;
}

module.exports = {
  generateStitchGrid,
  resizeStitchGrid,
};

