import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const LABEL_GUTTER = 0;

function PatternCanvasPreview({ pattern, cellSize, styling = "" }) {
  const canvasRef = useRef(null);
  const chartWidth = pattern.width * cellSize;
  const chartHeight = pattern.height * cellSize;
  const canvasWidth = LABEL_GUTTER + chartWidth + 1;
  const canvasHeight = LABEL_GUTTER + chartHeight + 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = "#fafafa";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.imageSmoothingEnabled = false;
    context.font = `600 ${Math.max(8, Math.floor(cellSize * 0.55))}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let row = 0; row < pattern.height; row += 1) {
      for (let column = 0; column < pattern.width; column += 1) {
        const gridIndex = row * pattern.width + column;
        const color = pattern.palette[pattern.grid[gridIndex]];

        if (!color) {
          continue;
        }

        const x = LABEL_GUTTER + column * cellSize;
        const y = LABEL_GUTTER + row * cellSize;

        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        context.fillRect(x, y, cellSize, cellSize);
      }
    }

    context.beginPath();
    context.strokeStyle = "rgba(5, 21, 42, 0.22)";
    context.lineWidth = 1;

    for (let column = 0; column <= pattern.width; column += 1) {
      const x = LABEL_GUTTER + column * cellSize + 0.5;
      context.moveTo(x, LABEL_GUTTER);
      context.lineTo(x, LABEL_GUTTER + chartHeight);
    }

    for (let row = 0; row <= pattern.height; row += 1) {
      const y = LABEL_GUTTER + row * cellSize + 0.5;
      context.moveTo(LABEL_GUTTER, y);
      context.lineTo(LABEL_GUTTER + chartWidth, y);
    }

    context.stroke();
    context.beginPath();
    context.strokeStyle = "rgba(5, 21, 42, 0.8)";
    context.lineWidth = 1;

    for (let column = 0; column <= pattern.width; column += 1) {
      const x = LABEL_GUTTER + column * cellSize;
      context.moveTo(x, LABEL_GUTTER);
      context.lineTo(x, LABEL_GUTTER + chartHeight);
    }

    for (let row = 0; row <= pattern.height; row += 1) {
      const y = LABEL_GUTTER + row * cellSize;
      context.moveTo(LABEL_GUTTER, y);
      context.lineTo(LABEL_GUTTER + chartWidth, y);
    }
  }, [canvasHeight, canvasWidth, cellSize, chartHeight, chartWidth, pattern]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      role="img"
      aria-label={`Cross-stitch pattern, ${pattern.width} by ${pattern.height} stitches, using ${pattern.palette.length} DMC colors`}
      className={`block w-full max-h-full p-8 object-contain ${styling}`}
    />
  );
}

PatternCanvasPreview.propTypes = {
  pattern: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    palette: PropTypes.arrayOf(
      PropTypes.shape({
        r: PropTypes.number.isRequired,
        g: PropTypes.number.isRequired,
        b: PropTypes.number.isRequired,
        symbol: PropTypes.string.isRequired,
      }),
    ).isRequired,
    grid: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  cellSize: PropTypes.number.isRequired,
  styling: PropTypes.string,
};

export default PatternCanvasPreview;
