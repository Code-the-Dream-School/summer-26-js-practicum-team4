const {
  generateStitchGrid,
} = require("../src/services/stitch-grid.service");

function createDmcPattern() {
  return {
    width: 3,
    height: 2,
    palette: [
      { dmcCode: "310", name: "Black", r: 0, g: 0, b: 0 },
      { dmcCode: "B5200", name: "Snow White", r: 255, g: 255, b: 255 },
    ],
    colorIndexes: [0, 1, 0, 1, 1, 0],
  };
}

describe("generateStitchGrid", () => {
  test("returns a flat stitch grid in raster order", () => {
    const result = generateStitchGrid(createDmcPattern());

    expect(result).toEqual({
      width: 3,
      height: 2,
      palette: [
        { dmcCode: "310", name: "Black", r: 0, g: 0, b: 0 },
        {
          dmcCode: "B5200",
          name: "Snow White",
          r: 255,
          g: 255,
          b: 255,
        },
      ],
      grid: [0, 1, 0, 1, 1, 0],
    });
    expect(result.grid).toHaveLength(result.width * result.height);
  });

  test("does not mutate or share mutable data with the input", () => {
    const dmcPattern = createDmcPattern();
    const original = structuredClone(dmcPattern);

    const result = generateStitchGrid(dmcPattern);
    result.palette[0].name = "Changed";
    result.grid[0] = 1;

    expect(dmcPattern).toEqual(original);
  });

  test("rejects invalid dimensions or grid length", () => {
    const invalidPatterns = [
      { ...createDmcPattern(), width: 0 },
      { ...createDmcPattern(), colorIndexes: [0, 1] },
    ];

    invalidPatterns.forEach((dmcPattern) => {
      expect(() => generateStitchGrid(dmcPattern)).toThrow(
        "A valid DMC pattern is required.",
      );
    });
  });

  test("rejects an invalid palette reference or DMC color", () => {
    const invalidPatterns = [
      { ...createDmcPattern(), colorIndexes: [0, 1, 2, 1, 1, 0] },
      {
        ...createDmcPattern(),
        palette: [{ dmcCode: "310", name: "Black", r: -1, g: 0, b: 0 }],
        colorIndexes: [0, 0, 0, 0, 0, 0],
      },
    ];

    invalidPatterns.forEach((dmcPattern) => {
      expect(() => generateStitchGrid(dmcPattern)).toThrow(
        "A valid DMC pattern is required.",
      );
    });
  });

  test("produces deterministic output", () => {
    const dmcPattern = createDmcPattern();

    expect(generateStitchGrid(dmcPattern)).toEqual(
      generateStitchGrid(dmcPattern),
    );
  });
});
