const sharp = require("sharp");

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
  generatePatternImage,
};
