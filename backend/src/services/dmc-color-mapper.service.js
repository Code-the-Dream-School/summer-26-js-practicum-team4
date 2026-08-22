const dmcColors = require("../data/dmc-colors.json");

// Baseline DMC RGB references sourced from https://threadcolors.com/.
const RGB_WEIGHTS = { r: 0.3, g: 0.59, b: 0.11 };

function isRgbColor(color) {
  return [color?.r, color?.g, color?.b].every(
    (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255,
  );
}

function validateReducedPattern(reducedPattern) {
  if (
    !Number.isInteger(reducedPattern?.width) ||
    reducedPattern.width <= 0 ||
    !Number.isInteger(reducedPattern?.height) ||
    reducedPattern.height <= 0 ||
    !Array.isArray(reducedPattern?.palette) ||
    reducedPattern.palette.length === 0 ||
    !reducedPattern.palette.every(isRgbColor) ||
    !Array.isArray(reducedPattern?.colorIndexes) ||
    reducedPattern.colorIndexes.length !==
      reducedPattern.width * reducedPattern.height ||
    !reducedPattern.colorIndexes.every(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < reducedPattern.palette.length,
    )
  ) {
    throw new Error("A valid reduced pattern is required.");
  }
}

// Give green more influence because brightness differences are most visible there.
function weightedRgbDistance(first, second) {
  const redDifference = first.r - second.r;
  const greenDifference = first.g - second.g;
  const blueDifference = first.b - second.b;

  return (
    RGB_WEIGHTS.r * redDifference ** 2 +
    RGB_WEIGHTS.g * greenDifference ** 2 +
    RGB_WEIGHTS.b * blueDifference ** 2
  );
}

function findClosestDmcColor(color) {
  let closestColor = dmcColors[0];
  let closestDistance = weightedRgbDistance(color, closestColor);

  for (let index = 1; index < dmcColors.length; index += 1) {
    const candidate = dmcColors[index];
    const distance = weightedRgbDistance(color, candidate);

    if (distance < closestDistance) {
      closestColor = candidate;
      closestDistance = distance;
    }
  }

  return closestColor;
}

function mapToDmc(reducedPattern) {
  validateReducedPattern(reducedPattern);

  const palette = [];
  const dmcIndexes = new Map();
  // Reuse one palette entry when multiple reduced colors match the same DMC thread.
  const sourceToDmcIndex = reducedPattern.palette.map((color) => {
    const dmcColor = findClosestDmcColor(color);
    let dmcIndex = dmcIndexes.get(dmcColor.dmcCode);

    if (dmcIndex === undefined) {
      dmcIndex = palette.length;
      dmcIndexes.set(dmcColor.dmcCode, dmcIndex);
      palette.push({ ...dmcColor });
    }

    return dmcIndex;
  });

  return {
    width: reducedPattern.width,
    height: reducedPattern.height,
    palette,
    colorIndexes: reducedPattern.colorIndexes.map(
      (index) => sourceToDmcIndex[index],
    ),
  };
}

module.exports = { mapToDmc };
