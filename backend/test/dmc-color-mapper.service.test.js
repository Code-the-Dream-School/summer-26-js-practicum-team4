const {
  mapToDmc,
} = require("../src/services/dmc-color-mapper.service");

describe("mapToDmc", () => {
  test("maps an exact RGB match to its DMC color", () => {
    const result = mapToDmc({
      width: 1,
      height: 1,
      palette: [{ r: 0, g: 0, b: 0 }],
      colorIndexes: [0],
    });

    expect(result).toEqual({
      width: 1,
      height: 1,
      palette: [{ dmcCode: "310", name: "Black", r: 0, g: 0, b: 0 }],
      colorIndexes: [0],
    });
  });

  test("uses weighted RGB distance to choose the closest DMC color", () => {
    const result = mapToDmc({
      width: 1,
      height: 1,
      palette: [{ r: 40, g: 40, b: 120 }],
      colorIndexes: [0],
    });

    expect(result.palette[0]).toMatchObject({
      dmcCode: "823",
      name: "Navy Blue Dark",
    });
  });

  test("deduplicates DMC colors and remaps color indexes", () => {
    const result = mapToDmc({
      width: 2,
      height: 2,
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 1, g: 1, b: 1 },
        { r: 255, g: 255, b: 255 },
      ],
      colorIndexes: [0, 1, 2, 1],
    });

    expect(result.palette.map((color) => color.dmcCode)).toEqual([
      "310",
      "B5200",
    ]);
    expect(result.colorIndexes).toEqual([0, 0, 1, 0]);
  });

  test("does not mutate the reduced pattern", () => {
    const reducedPattern = {
      width: 2,
      height: 1,
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ],
      colorIndexes: [0, 1],
    };
    const original = structuredClone(reducedPattern);

    const result = mapToDmc(reducedPattern);

    expect(reducedPattern).toEqual(original);
    expect(result.colorIndexes).toHaveLength(
      reducedPattern.width * reducedPattern.height,
    );
  });

  test("rejects an invalid reduced pattern", () => {
    expect(() =>
      mapToDmc({
        width: 2,
        height: 1,
        palette: [{ r: 0, g: 0, b: 0 }],
        colorIndexes: [0],
      }),
    ).toThrow("A valid reduced pattern is required.");
  });
});
