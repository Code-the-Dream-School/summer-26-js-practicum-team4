const sharp = require("sharp");

const {
  generatePattern,
} = require("../src/services/pattern-pipeline.service");

async function createTestImage() {
  const width = 20;
  const height = 20;
  const pixels = Buffer.alloc(width * height * 3);

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 3;
    pixels[offset] = (index * 47) % 256;
    pixels[offset + 1] = (index * 89) % 256;
    pixels[offset + 2] = (index * 131) % 256;
  }

  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
}

async function createTwoColorImage() {
  const width = 20;
  const height = 20;
  const pixels = Buffer.alloc(width * height * 3);

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const offset = (row * width + column) * 3;
      const isRed = column < width / 2;

      pixels[offset] = 255;
      pixels[offset + 1] = isRed ? 0 : 255;
      pixels[offset + 2] = isRed ? 0 : 255;
    }
  }

  return sharp(pixels, { raw: { width, height, channels: 3 } })
    .png()
    .toBuffer();
}

describe("generatePattern", () => {
  test("runs the full pipeline and returns structured pattern data with a preview", async () => {
    const image = await createTestImage();

    const result = await generatePattern(image, { width: 10 });

    expect(result.pattern.width).toBe(10);
    expect(result.pattern.height).toBe(10);
    expect(result.pattern.grid).toHaveLength(100);
    expect(result.pattern.palette.length).toBeLessThanOrEqual(48);
    expect(
      result.pattern.palette.every(
        (color) =>
          color.dmcCode &&
          color.name &&
          Number.isInteger(color.r) &&
          Number.isInteger(color.g) &&
          Number.isInteger(color.b) &&
          typeof color.symbol === "string",
      ),
    ).toBe(true);
    expect(result.preview).toMatchObject({
      width: 10,
      height: 10,
      format: "png",
    });
    expect(result.chart).toMatchObject({
      width: 200,
      height: 200,
      format: "png",
      cellSize: 20,
    });
  });

  test("uses the internal quality limit when only width is provided", async () => {
    const image = await createTestImage();

    const result = await generatePattern(image, { width: 10 });

    expect(result.pattern.palette.length).toBeLessThanOrEqual(48);
    expect(result.pattern.grid).toHaveLength(100);
  });

  test("builds the preview from the final pattern grid", async () => {
    const image = await createTestImage();
    const { pattern, preview } = await generatePattern(image, {
      width: 10,
    });
    const { data, info } = await sharp(preview.buffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    expect(info).toMatchObject({
      width: pattern.width,
      height: pattern.height,
      channels: 3,
    });

    pattern.grid.forEach((paletteIndex, stitchIndex) => {
      const color = pattern.palette[paletteIndex];
      const offset = stitchIndex * 3;

      expect([...data.subarray(offset, offset + 3)]).toEqual([
        color.r,
        color.g,
        color.b,
      ]);
    });
  });

  test("supports height as the single stitch dimension", async () => {
    const image = await createTestImage();

    const { pattern } = await generatePattern(image, { height: 10 });

    expect(pattern.width).toBe(10);
    expect(pattern.height).toBe(10);
    expect(pattern.grid).toHaveLength(100);
  });

  test("keeps a two-color image at two colors", async () => {
    const image = await createTwoColorImage();

    const { pattern } = await generatePattern(image, { width: 20 });

    expect(pattern.palette).toHaveLength(2);
    expect(new Set(pattern.grid).size).toBe(2);
  });

  test("does not mutate the image buffer or options", async () => {
    const image = await createTestImage();
    const originalImage = Buffer.from(image);
    const options = { width: 10 };
    const originalOptions = structuredClone(options);

    await generatePattern(image, options);

    expect(image.equals(originalImage)).toBe(true);
    expect(options).toEqual(originalOptions);
  });

  test("produces deterministic pattern data and preview output", async () => {
    const image = await createTestImage();
    const options = { width: 10 };

    const first = await generatePattern(image, options);
    const second = await generatePattern(image, options);

    expect(first.pattern).toEqual(second.pattern);
    expect(first.preview).toMatchObject(second.preview);
    expect(first.preview.buffer.equals(second.preview.buffer)).toBe(true);
    expect(first.chart).toMatchObject(second.chart);
    expect(first.chart.buffer.equals(second.chart.buffer)).toBe(true);
  });
});
