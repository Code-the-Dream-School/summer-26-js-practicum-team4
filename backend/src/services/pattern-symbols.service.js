const SYMBOLS = Object.freeze(
  Array.from("ABCDEFGHJKLMNPQRSTUVWXYZ23456789!#$%&*+-/<=>?@^~"),
);

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

function validateStitchGrid(stitchGrid) {
  if (
    !Number.isInteger(stitchGrid?.width) ||
    stitchGrid.width <= 0 ||
    !Number.isInteger(stitchGrid?.height) ||
    stitchGrid.height <= 0 ||
    !Array.isArray(stitchGrid?.palette) ||
    stitchGrid.palette.length === 0 ||
    stitchGrid.palette.length > SYMBOLS.length ||
    !stitchGrid.palette.every(isDmcColor) ||
    !Array.isArray(stitchGrid?.grid) ||
    stitchGrid.grid.length !== stitchGrid.width * stitchGrid.height ||
    !stitchGrid.grid.every(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < stitchGrid.palette.length,
    )
  ) {
    throw new Error("A valid stitch grid with at most 48 colors is required.");
  }
}

function addPatternSymbols(stitchGrid) {
  validateStitchGrid(stitchGrid);

  return {
    width: stitchGrid.width,
    height: stitchGrid.height,
    palette: stitchGrid.palette.map((color, index) => ({
      ...color,
      symbol: SYMBOLS[index],
    })),
    grid: [...stitchGrid.grid],
  };
}

module.exports = { addPatternSymbols };
