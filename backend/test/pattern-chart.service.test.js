const sharp = require("sharp");

const {
  renderPatternChart,
} = require("../src/services/pattern-chart.service");

function createPattern({ width = 2, height = 1 } = {}) {
  return {
    width,
    height,
    palette: [
      { dmcCode: "321", name: "Red", r: 199, g: 43, b: 59, symbol: "A" },
      { dmcCode: "995", name: "Blue", r: 38, g: 150, b: 182, symbol: "B" },
    ],
    grid: Array.from({ length: width * height }, (_, index) => index % 2),
  };
}

async function getRawImage(buffer) {
  return sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
}

function getPixel(data, width, x, y) {
  const offset = (y * width + x) * 3;
  return [...data.subarray(offset, offset + 3)];
}

describe("renderPatternChart", () => {
  test("creates a PNG using square 20 pixel stitch cells", async () => {
    const result = await renderPatternChart(createPattern());
    const metadata = await sharp(result.buffer).metadata();

    expect(result).toMatchObject({
      width: 40,
      height: 20,
      format: "png",
      cellSize: 20,
    });
    expect(metadata).toMatchObject({ width: 40, height: 20, format: "png" });
  });

  test("preserves DMC colors and raster order without smoothing cells", async () => {
    const result = await renderPatternChart(createPattern());
    const { data, info } = await getRawImage(result.buffer);

    expect(getPixel(data, info.width, 3, 3)).toEqual([199, 43, 59]);
    expect(getPixel(data, info.width, 23, 3)).toEqual([38, 150, 182]);
  });

  test("renders a visible symbol inside each cell", async () => {
    const result = await renderPatternChart({
      width: 1,
      height: 1,
      palette: [
        {
          dmcCode: "B5200",
          name: "Snow White",
          r: 255,
          g: 255,
          b: 255,
          symbol: "A",
        },
      ],
      grid: [0],
    });
    const { data, info } = await getRawImage(result.buffer);
    let darkInteriorPixels = 0;

    for (let y = 4; y < 16; y += 1) {
      for (let x = 4; x < 16; x += 1) {
        const [r, g, b] = getPixel(data, info.width, x, y);
        if (r < 100 && g < 100 && b < 100) darkInteriorPixels += 1;
      }
    }

    expect(darkInteriorPixels).toBeGreaterThan(0);
  });

  test("uses thicker major grid lines every 10 stitches", async () => {
    const result = await renderPatternChart(createPattern({ width: 11 }));
    const { data, info } = await getRawImage(result.buffer);

    const normalLinePixels = [19, 20, 21].filter((x) =>
      getPixel(data, info.width, x, 3).every((channel) => channel === 51),
    ).length;
    const majorLinePixels = [199, 200, 201].filter((x) =>
      getPixel(data, info.width, x, 3).every((channel) => channel === 51),
    ).length;

    expect(majorLinePixels).toBeGreaterThan(normalLinePixels);
  });

  test("does not mutate the pattern and produces deterministic output", async () => {
    const pattern = createPattern();
    const original = structuredClone(pattern);

    const first = await renderPatternChart(pattern);
    const second = await renderPatternChart(pattern);

    expect(pattern).toEqual(original);
    expect(first).toMatchObject(second);
    expect(first.buffer.equals(second.buffer)).toBe(true);
  });

  test("rejects an invalid palette, grid, or symbol", async () => {
    const invalidPatterns = [
      { ...createPattern(), grid: [0] },
      { ...createPattern(), grid: [0, 2] },
      {
        ...createPattern(),
        palette: [
          { dmcCode: "321", name: "Red", r: 199, g: 43, b: 59, symbol: "😀" },
        ],
        grid: [0, 0],
      },
    ];

    for (const pattern of invalidPatterns) {
      await expect(renderPatternChart(pattern)).rejects.toThrow(
        "A valid pattern with unique symbols is required.",
      );
    }
  });
});
