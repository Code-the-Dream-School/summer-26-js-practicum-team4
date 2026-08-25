const sharp = require("sharp");

const {
  renderPatternPreview,
} = require("../src/services/pattern-preview.service");

function createStitchGrid() {
  return {
    width: 3,
    height: 2,
    palette: [
      { dmcCode: "310", name: "Black", r: 0, g: 0, b: 0 },
      { dmcCode: "321", name: "Red", r: 199, g: 43, b: 59 },
      { dmcCode: "B5200", name: "Snow White", r: 255, g: 255, b: 255 },
    ],
    grid: [0, 1, 2, 2, 1, 0],
  };
}

describe("renderPatternPreview", () => {
  test("returns a PNG with the stitch grid dimensions", async () => {
    const result = await renderPatternPreview(createStitchGrid());
    const metadata = await sharp(result.buffer).metadata();

    expect(result).toMatchObject({ width: 3, height: 2, format: "png" });
    expect(metadata).toMatchObject({
      width: 3,
      height: 2,
      format: "png",
    });
  });

  test("renders exact DMC colors in raster order", async () => {
    const result = await renderPatternPreview(createStitchGrid());
    const { data, info } = await sharp(result.buffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    expect(info.channels).toBe(3);
    expect([...data]).toEqual([
      0, 0, 0, 199, 43, 59, 255, 255, 255, 255, 255, 255, 199, 43, 59, 0,
      0, 0,
    ]);
  });

  test("does not mutate the stitch grid", async () => {
    const stitchGrid = createStitchGrid();
    const original = structuredClone(stitchGrid);

    await renderPatternPreview(stitchGrid);

    expect(stitchGrid).toEqual(original);
  });

  test("produces deterministic output", async () => {
    const stitchGrid = createStitchGrid();

    const first = await renderPatternPreview(stitchGrid);
    const second = await renderPatternPreview(stitchGrid);

    expect(first).toMatchObject(second);
    expect(first.buffer.equals(second.buffer)).toBe(true);
  });

  test("rejects invalid dimensions or grid length", async () => {
    const invalidGrids = [
      { ...createStitchGrid(), width: 0 },
      { ...createStitchGrid(), grid: [0, 1] },
    ];

    for (const stitchGrid of invalidGrids) {
      await expect(renderPatternPreview(stitchGrid)).rejects.toThrow(
        "A valid stitch grid is required.",
      );
    }
  });

  test("rejects an invalid palette or palette index", async () => {
    const invalidGrids = [
      { ...createStitchGrid(), grid: [0, 1, 3, 2, 1, 0] },
      {
        ...createStitchGrid(),
        palette: [{ dmcCode: "310", name: "Black", r: 0, g: 0, b: 256 }],
        grid: [0, 0, 0, 0, 0, 0],
      },
    ];

    for (const stitchGrid of invalidGrids) {
      await expect(renderPatternPreview(stitchGrid)).rejects.toThrow(
        "A valid stitch grid is required.",
      );
    }
  });
});
