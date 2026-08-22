const sharp = require("sharp");

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
    throw new Error("A valid stitch grid is required.");
  }
}

async function renderPatternPreview(stitchGrid) {
  validateStitchGrid(stitchGrid);

  // Rebuild the image in raster order, using one DMC RGB color per stitch.
  const pixels = Buffer.alloc(stitchGrid.grid.length * 3);

  stitchGrid.grid.forEach((paletteIndex, stitchIndex) => {
    const color = stitchGrid.palette[paletteIndex];
    const offset = stitchIndex * 3;

    pixels[offset] = color.r;
    pixels[offset + 1] = color.g;
    pixels[offset + 2] = color.b;
  });

  const buffer = await sharp(pixels, {
    raw: {
      width: stitchGrid.width,
      height: stitchGrid.height,
      channels: 3,
    },
  })
    .png()
    .toBuffer();

  return {
    buffer,
    width: stitchGrid.width,
    height: stitchGrid.height,
    format: "png",
  };
}

module.exports = { renderPatternPreview };
