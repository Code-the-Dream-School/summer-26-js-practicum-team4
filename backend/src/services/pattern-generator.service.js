const sharp = require("sharp");

const MIN_STITCH_DIMENSION = 10;
const MAX_STITCH_DIMENSION = 200;
const MIN_COLORS = 8;
const MAX_COLORS = 48;
const WHITE_BACKGROUND = { r: 255, g: 255, b: 255 };

function validateStitchDimension(name, value) {
  if (
    !Number.isInteger(value) ||
    value < MIN_STITCH_DIMENSION ||
    value > MAX_STITCH_DIMENSION
  ) {
    throw new Error(
      `${name} must be an integer between ${MIN_STITCH_DIMENSION} and ${MAX_STITCH_DIMENSION}.`,
    );
  }
}

function getOrientedDimensions(metadata) {
  const { width, height } = metadata.autoOrient;

  if (!width || !height) {
    throw new Error("Unable to determine the image dimensions.");
  }

  return { width, height };
}

async function preprocessImage(imageBuffer, options = {}) {
  if (!imageBuffer) {
    throw new Error("An image buffer is required.");
  }

  const hasWidth = options.width !== undefined 
  const hasHeight = options.height !== undefined 

  if (hasWidth === hasHeight) {
    throw new Error("Provide exactly one stitch dimension: width or height.");
  }

  const suppliedDimensionName = hasWidth ? "width" : "height";
  const suppliedDimension = options[suppliedDimensionName];
  validateStitchDimension(suppliedDimensionName, suppliedDimension);

  const metadata = await sharp(imageBuffer).metadata();
  const source = getOrientedDimensions(metadata);

  // Calculate the missing dimension to keep the original aspect ratio.
  const resolvedWidth = hasWidth
    ? suppliedDimension
    : Math.round(suppliedDimension * (source.width / source.height));
  const resolvedHeight = hasHeight
    ? suppliedDimension
    : Math.round(suppliedDimension * (source.height / source.width));

  try {
    validateStitchDimension("resolved width", resolvedWidth);
    validateStitchDimension("resolved height", resolvedHeight);
  } catch (error) {
    error.code = "PATTERN_DIMENSION_OUT_OF_RANGE";
    error.suppliedDimensionName = suppliedDimensionName;
    throw error;
  }

  const resizeOptions = hasWidth
    ? { width: resolvedWidth }
    : { height: resolvedHeight };

  const { data: buffer, info } = await sharp(imageBuffer)
    .rotate()
    .flatten({ background: WHITE_BACKGROUND })
    .toColourspace("srgb")
    .resize(resizeOptions)
    .png()
    .toBuffer({ resolveWithObject: true });

  return {
    buffer,
    width: info.width,
    height: info.height,
    format: "png",
    colorSpace: "srgb",
  };
}

function getBoxStats(colors) {
  const ranges = [
    Math.max(...colors.map((color) => color.r)) -
      Math.min(...colors.map((color) => color.r)),
    Math.max(...colors.map((color) => color.g)) -
      Math.min(...colors.map((color) => color.g)),
    Math.max(...colors.map((color) => color.b)) -
      Math.min(...colors.map((color) => color.b)),
  ];

  return {
    range: Math.max(...ranges),
    channel: ranges.indexOf(Math.max(...ranges)),
    weight: colors.reduce((total, color) => total + color.count, 0),
  };
}

function splitBox(colors) {
  const { channel, weight } = getBoxStats(colors);
  const channels = ["r", "g", "b"];
  const primaryChannel = channels[channel];
  const secondaryChannels = channels.filter((name) => name !== primaryChannel);
  const sorted = [...colors].sort(
    (first, second) =>
      first[primaryChannel] - second[primaryChannel] ||
      first[secondaryChannels[0]] - second[secondaryChannels[0]] ||
      first[secondaryChannels[1]] - second[secondaryChannels[1]],
  );
  const midpoint = weight / 2;
  let cumulativeWeight = 0;
  let splitIndex = 0;

  while (
    splitIndex < sorted.length - 1 &&
    cumulativeWeight + sorted[splitIndex].count < midpoint
  ) {
    cumulativeWeight += sorted[splitIndex].count;
    splitIndex += 1;
  }

  splitIndex = Math.min(splitIndex + 1, sorted.length - 1);

  return [sorted.slice(0, splitIndex), sorted.slice(splitIndex)];
}

function averageBox(colors) {
  const weight = colors.reduce((total, color) => total + color.count, 0);

  return {
    r: Math.round(
      colors.reduce((total, color) => total + color.r * color.count, 0) /
        weight,
    ),
    g: Math.round(
      colors.reduce((total, color) => total + color.g * color.count, 0) /
        weight,
    ),
    b: Math.round(
      colors.reduce((total, color) => total + color.b * color.count, 0) /
        weight,
    ),
  };
}

async function reduceColors(preprocessedImage, { maxColors } = {}) {
  if (
    !Number.isInteger(maxColors) ||
    maxColors < MIN_COLORS ||
    maxColors > MAX_COLORS
  ) {
    throw new Error(
      `maxColors must be an integer between ${MIN_COLORS} and ${MAX_COLORS}.`,
    );
  }

  if (
    !preprocessedImage?.buffer ||
    !Number.isInteger(preprocessedImage.width) ||
    !Number.isInteger(preprocessedImage.height)
  ) {
    throw new Error("A valid preprocessed image is required.");
  }

  const { data, info } = await sharp(preprocessedImage.buffer)
    .toColourspace("srgb")
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (
    info.width !== preprocessedImage.width ||
    info.height !== preprocessedImage.height
  ) {
    throw new Error("Preprocessed image dimensions do not match its buffer.");
  }

  // Count repeated RGB colors while keeping each pixel's original raster position.
  const histogram = new Map();
  const pixelKeys = [];

  for (let offset = 0; offset < data.length; offset += info.channels) {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const key = `${r},${g},${b}`;
    const existing = histogram.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      histogram.set(key, { key, r, g, b, count: 1 });
    }

    pixelKeys.push(key);
  }

  let boxes = [[...histogram.values()]];

  // Split the most varied color group until we reach the requested color limit.
  while (boxes.length < maxColors) {
    let boxIndex = -1;
    let selectedStats = null;

    boxes.forEach((box, index) => {
      if (box.length < 2) return;

      const stats = getBoxStats(box);
      if (
        !selectedStats ||
        stats.range > selectedStats.range ||
        (stats.range === selectedStats.range &&
          stats.weight > selectedStats.weight)
      ) {
        boxIndex = index;
        selectedStats = stats;
      }
    });

    if (boxIndex === -1) break;

    const [first, second] = splitBox(boxes[boxIndex]);
    boxes.splice(boxIndex, 1, first, second);
  }

  // Average each color group and map every source color to its new palette index.
  const palette = [];
  const paletteIndexes = new Map();
  const colorToPaletteIndex = new Map();

  boxes.forEach((box) => {
    const color = averageBox(box);
    const paletteKey = `${color.r},${color.g},${color.b}`;
    let paletteIndex = paletteIndexes.get(paletteKey);

    if (paletteIndex === undefined) {
      paletteIndex = palette.length;
      paletteIndexes.set(paletteKey, paletteIndex);
      palette.push(color);
    }

    box.forEach((sourceColor) => {
      colorToPaletteIndex.set(sourceColor.key, paletteIndex);
    });
  });

  return {
    width: info.width,
    height: info.height,
    palette,
    colorIndexes: pixelKeys.map((key) => colorToPaletteIndex.get(key)),
  };
}

async function generatePatternImage(imageBuffer, options = {}) {
  const { width = 50, height = 50 } = options;

  if (!imageBuffer) {
    throw new Error("An image buffer is required.");
  }

  const patternBuffer = await sharp(imageBuffer)
    .resize(width, height, {
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
    .png()
    .toBuffer();

  return {
    buffer: patternBuffer,
    width,
    height,
    format: "png",
  };
}

module.exports = {
  preprocessImage,
  reduceColors,
  generatePatternImage,
};
