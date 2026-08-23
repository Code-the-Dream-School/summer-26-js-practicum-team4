const {
  addPatternSymbols,
} = require("../src/services/pattern-symbols.service");

function createStitchGrid() {
  return {
    width: 2,
    height: 2,
    palette: [
      { dmcCode: "310", name: "Black", r: 0, g: 0, b: 0 },
      { dmcCode: "321", name: "Red", r: 199, g: 43, b: 59 },
      { dmcCode: "B5200", name: "Snow White", r: 255, g: 255, b: 255 },
    ],
    grid: [0, 1, 2, 0],
  };
}

function createLargeStitchGrid(colorCount) {
  return {
    width: colorCount,
    height: 1,
    palette: Array.from({ length: colorCount }, (_, index) => ({
      dmcCode: String(index),
      name: `Color ${index}`,
      r: index,
      g: index,
      b: index,
    })),
    grid: Array.from({ length: colorCount }, (_, index) => index),
  };
}

describe("addPatternSymbols", () => {
  test("adds one symbol to each palette entry for use as the legend", () => {
    const result = addPatternSymbols(createStitchGrid());

    expect(result.palette).toEqual([
      { dmcCode: "310", name: "Black", r: 0, g: 0, b: 0, symbol: "A" },
      { dmcCode: "321", name: "Red", r: 199, g: 43, b: 59, symbol: "B" },
      {
        dmcCode: "B5200",
        name: "Snow White",
        r: 255,
        g: 255,
        b: 255,
        symbol: "C",
      },
    ]);
  });

  test("assigns 48 unique printable symbols", () => {
    const result = addPatternSymbols(createLargeStitchGrid(48));
    const symbols = result.palette.map((color) => color.symbol);

    expect(symbols).toHaveLength(48);
    expect(new Set(symbols).size).toBe(48);
    expect(symbols.every((symbol) => symbol.length === 1 && symbol !== " ")).toBe(
      true,
    );
  });

  test("preserves palette order and produces deterministic output", () => {
    const stitchGrid = createStitchGrid();
    const first = addPatternSymbols(stitchGrid);
    const second = addPatternSymbols(stitchGrid);

    expect(first).toEqual(second);
    expect(first.palette.map((color) => color.dmcCode)).toEqual([
      "310",
      "321",
      "B5200",
    ]);
  });

  test("preserves the grid and does not mutate or share mutable input data", () => {
    const stitchGrid = createStitchGrid();
    const original = structuredClone(stitchGrid);

    const result = addPatternSymbols(stitchGrid);
    expect(result.grid).toEqual(original.grid);

    result.palette[0].name = "Changed";
    result.grid[0] = 2;

    expect(stitchGrid).toEqual(original);
  });

  test("rejects an invalid grid, palette, or palette index", () => {
    const invalidGrids = [
      { ...createStitchGrid(), width: 0 },
      { ...createStitchGrid(), grid: [0, 1] },
      { ...createStitchGrid(), grid: [0, 1, 3, 0] },
      {
        ...createStitchGrid(),
        palette: [{ dmcCode: "310", name: "Black", r: -1, g: 0, b: 0 }],
        grid: [0, 0, 0, 0],
      },
    ];

    invalidGrids.forEach((stitchGrid) => {
      expect(() => addPatternSymbols(stitchGrid)).toThrow(
        "A valid stitch grid with at most 48 colors is required.",
      );
    });
  });

  test("rejects a palette larger than the supported symbol set", () => {
    expect(() => addPatternSymbols(createLargeStitchGrid(49))).toThrow(
      "A valid stitch grid with at most 48 colors is required.",
    );
  });
});
