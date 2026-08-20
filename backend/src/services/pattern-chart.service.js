const sharp = require("sharp");

const CELL_SIZE = 20;
const SYMBOL_FONT_SIZE = 12;
const GRID_COLOR = "#333333";

function isChartColor(color) {
  const isPrintableAsciiSymbol =
    typeof color?.symbol === "string" &&
    color.symbol.length === 1 &&
    color.symbol.charCodeAt(0) >= 33 &&
    color.symbol.charCodeAt(0) <= 126;

  return (
    typeof color?.dmcCode === "string" &&
    color.dmcCode.length > 0 &&
    typeof color.name === "string" &&
    color.name.length > 0 &&
    [color.r, color.g, color.b].every(
      (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
    ) &&
    isPrintableAsciiSymbol
  );
}

function validatePattern(pattern) {
  const symbols = Array.isArray(pattern?.palette)
    ? pattern.palette.map((color) => color?.symbol)
    : [];

  if (
    !Number.isInteger(pattern?.width) ||
    pattern.width <= 0 ||
    !Number.isInteger(pattern?.height) ||
    pattern.height <= 0 ||
    !Array.isArray(pattern?.palette) ||
    pattern.palette.length === 0 ||
    !pattern.palette.every(isChartColor) ||
    new Set(symbols).size !== symbols.length ||
    !Array.isArray(pattern?.grid) ||
    pattern.grid.length !== pattern.width * pattern.height ||
    !pattern.grid.every(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < pattern.palette.length,
    )
  ) {
    throw new Error("A valid pattern with unique symbols is required.");
  }
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getSymbolColor(color) {
  const brightness = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  return brightness > 160 ? "#000000" : "#ffffff";
}

function createOverlay(pattern, width, height) {
  const elements = [];

  pattern.grid.forEach((paletteIndex, stitchIndex) => {
    const color = pattern.palette[paletteIndex];
    const column = stitchIndex % pattern.width;
    const row = Math.floor(stitchIndex / pattern.width);
    const x = column * CELL_SIZE + CELL_SIZE / 2;
    const y = row * CELL_SIZE + CELL_SIZE / 2;

    elements.push(
      `<text x="${x}" y="${y}" fill="${getSymbolColor(color)}" ` +
        `font-family="Arial, Helvetica, sans-serif" font-size="${SYMBOL_FONT_SIZE}" ` +
        `font-weight="700" text-anchor="middle" dominant-baseline="central">` +
        `${escapeXml(color.symbol)}</text>`,
    );
  });

  // Draw a stronger line every 10 stitches to make large sections easier to count.
  for (let column = 0; column <= pattern.width; column += 1) {
    const position = column * CELL_SIZE;
    const lineWidth = column % 10 === 0 ? 2 : 1;
    elements.push(
      `<line x1="${position}" y1="0" x2="${position}" y2="${height}" ` +
        `stroke="${GRID_COLOR}" stroke-width="${lineWidth}"/>`,
    );
  }

  for (let row = 0; row <= pattern.height; row += 1) {
    const position = row * CELL_SIZE;
    const lineWidth = row % 10 === 0 ? 2 : 1;
    elements.push(
      `<line x1="0" y1="${position}" x2="${width}" y2="${position}" ` +
        `stroke="${GRID_COLOR}" stroke-width="${lineWidth}"/>`,
    );
  }

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
      `viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">` +
      `${elements.join("")}</svg>`,
  );
}

async function renderPatternChart(pattern) {
  validatePattern(pattern);

  const pixels = Buffer.alloc(pattern.grid.length * 3);

  pattern.grid.forEach((paletteIndex, stitchIndex) => {
    const color = pattern.palette[paletteIndex];
    const offset = stitchIndex * 3;

    pixels[offset] = color.r;
    pixels[offset + 1] = color.g;
    pixels[offset + 2] = color.b;
  });

  const width = pattern.width * CELL_SIZE;
  const height = pattern.height * CELL_SIZE;
  const overlay = createOverlay(pattern, width, height);
  const buffer = await sharp(pixels, {
    raw: {
      width: pattern.width,
      height: pattern.height,
      channels: 3,
    },
  })
    .resize(width, height, { kernel: sharp.kernel.nearest })
    .composite([{ input: overlay }])
    .png()
    .toBuffer();

  return { buffer, width, height, format: "png", cellSize: CELL_SIZE };
}

module.exports = { renderPatternChart };
