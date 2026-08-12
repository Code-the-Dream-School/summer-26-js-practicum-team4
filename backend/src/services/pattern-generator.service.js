const sharp = require("sharp");

const MIN_STITCH_DIMENSION = 10;
const MAX_STITCH_DIMENSION = 200;
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

  const hasWidth = options.width !== undefined && options.width !== null;
  const hasHeight = options.height !== undefined && options.height !== null;

  if (hasWidth === hasHeight) {
    throw new Error("Provide exactly one stitch dimension: width or height.");
  }

  const suppliedDimensionName = hasWidth ? "width" : "height";
  const suppliedDimension = options[suppliedDimensionName];
  validateStitchDimension(suppliedDimensionName, suppliedDimension);

  const metadata = await sharp(imageBuffer).metadata();
  const source = getOrientedDimensions(metadata);

  const resolvedWidth = hasWidth
    ? suppliedDimension
    : Math.round(suppliedDimension * (source.width / source.height));
  const resolvedHeight = hasHeight
    ? suppliedDimension
    : Math.round(suppliedDimension * (source.height / source.width));

  validateStitchDimension("resolved width", resolvedWidth);
  validateStitchDimension("resolved height", resolvedHeight);

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
  generatePatternImage,
};
