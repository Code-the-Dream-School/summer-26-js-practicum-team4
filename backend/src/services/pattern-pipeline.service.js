const sharp = require("sharp");

const {
  preprocessImage,
  reduceColors,
} = require("./pattern-generator.service");
const { mapToDmc } = require("./dmc-color-mapper.service");
const { generateStitchGrid } = require("./stitch-grid.service");
const { addPatternSymbols } = require("./pattern-symbols.service");
const { renderPatternPreview } = require("./pattern-preview.service");
const { renderPatternChart } = require("./pattern-chart.service");

const QUALITY_COLOR_LIMIT = 48;

async function generatePattern(imageBuffer, options = {}) {
  const { width, height } = options;

  const preprocessedImage = await preprocessImage(imageBuffer, {
    width,
    height,
  });
  const reducedPattern = await reduceColors(preprocessedImage, {
    maxColors: QUALITY_COLOR_LIMIT,
  });
  const dmcPattern = mapToDmc(reducedPattern);
  const stitchGrid = generateStitchGrid(dmcPattern);
  const pattern = addPatternSymbols(stitchGrid);
  const preview = await renderPatternPreview(pattern);
  const chart = await renderPatternChart(pattern);

  return { pattern, preview, chart };
}

module.exports = { generatePattern };
