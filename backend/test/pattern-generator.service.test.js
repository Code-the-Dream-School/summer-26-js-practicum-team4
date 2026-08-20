const sharp = require("sharp");

const {
  preprocessImage,
  reduceColors,
} = require("../src/services/pattern-generator.service");

async function createImage({
  width = 40,
  height = 20,
  channels = 3,
  background = { r: 40, g: 80, b: 120 },
  format = "png",
  orientation,
} = {}) {
  let pipeline = sharp({
    create: {
      width,
      height,
      channels,
      background,
    },
  });

  if (orientation) {
    pipeline = pipeline.withMetadata({ orientation });
  }

  return pipeline.toFormat(format).toBuffer();
}

describe("preprocessImage", () => {
  test("calculates height from a supplied width for a landscape image", async () => {
    const image = await createImage({ width: 40, height: 20 });

    const result = await preprocessImage(image, { width: 20 });

    expect(result).toMatchObject({
      width: 20,
      height: 10,
      format: "png",
      colorSpace: "srgb",
    });
  });

  test("calculates width from a supplied height for a portrait image", async () => {
    const image = await createImage({ width: 20, height: 40 });

    const result = await preprocessImage(image, { height: 20 });

    expect(result.width).toBe(10);
    expect(result.height).toBe(20);
  });

  test("applies EXIF orientation before calculating the missing dimension", async () => {
    const image = await createImage({
      width: 40,
      height: 20,
      format: "jpeg",
      orientation: 6,
    });

    const result = await preprocessImage(image, { width: 20 });

    expect(result.width).toBe(20);
    expect(result.height).toBe(40);
  });

  test("returns an sRGB raster with one pixel per resolved stitch", async () => {
    const image = await createImage({ width: 60, height: 40 });

    const result = await preprocessImage(image, { width: 30 });
    const metadata = await sharp(result.buffer).metadata();

    expect(metadata).toMatchObject({
      width: 30,
      height: 20,
      format: "png",
      space: "srgb",
    });
  });

  test("composites transparent pixels onto a white background", async () => {
    const image = await createImage({
      width: 20,
      height: 20,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0 },
    });

    const result = await preprocessImage(image, { width: 10 });
    const { data, info } = await sharp(result.buffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    expect(info.channels).toBe(3);
    expect([...data.subarray(0, 3)]).toEqual([255, 255, 255]);
  });

  test("composites partially transparent pixels onto a white background", async () => {
    const image = await createImage({
      width: 20,
      height: 20,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 },
    });

    const result = await preprocessImage(image, { width: 10 });
    const pixel = await sharp(result.buffer).raw().toBuffer();

    expect(pixel[0]).toBe(255);
    expect(pixel[1]).toBeGreaterThanOrEqual(127);
    expect(pixel[1]).toBeLessThanOrEqual(128);
    expect(pixel[2]).toBeGreaterThanOrEqual(127);
    expect(pixel[2]).toBeLessThanOrEqual(128);
  });

  test.each([
    [undefined, "no dimensions"],
    [{ width: 20, height: 20 }, "both dimensions"],
  ])("rejects %s", async (options) => {
    const image = await createImage();

    await expect(preprocessImage(image, options)).rejects.toThrow(
      "Provide exactly one stitch dimension: width or height.",
    );
  });

  test.each([
    [{ width: 10.5 }, "non-integer"],
    [{ width: 0 }, "zero"],
    [{ height: -10 }, "negative"],
    [{ width: 9 }, "below minimum"],
    [{ height: 201 }, "above maximum"],
  ])("rejects a %s stitch dimension", async (options) => {
    const image = await createImage();

    await expect(preprocessImage(image, options)).rejects.toThrow(
      /must be an integer between 10 and 200/,
    );
  });

  test("rejects a calculated dimension outside the supported range", async () => {
    const image = await createImage({ width: 200, height: 10 });

    await expect(preprocessImage(image, { height: 20 })).rejects.toThrow(
      "resolved width must be an integer between 10 and 200.",
    );
  });

  test("rejects an invalid image buffer", async () => {
    await expect(
      preprocessImage(Buffer.from("not an image"), { width: 20 }),
    ).rejects.toThrow();
  });

  test("produces deterministic output", async () => {
    const image = await createImage({ width: 60, height: 40 });

    const first = await preprocessImage(image, { width: 30 });
    const second = await preprocessImage(image, { width: 30 });

    expect(first.width).toBe(second.width);
    expect(first.height).toBe(second.height);
    expect(first.buffer.equals(second.buffer)).toBe(true);
  });
});

async function createPreprocessedColorGrid(colors) {
  const width = 10;
  const height = 10;
  const pixels = Buffer.alloc(width * height * 3);

  for (let index = 0; index < width * height; index += 1) {
    const color = colors[index % colors.length];
    pixels.set(color, index * 3);
  }

  const buffer = await sharp(pixels, {
    raw: { width, height, channels: 3 },
  })
    .png()
    .toBuffer();

  return { buffer, width, height, format: "png", colorSpace: "srgb" };
}

describe("reduceColors", () => {
  const manyColors = Array.from({ length: 32 }, (_, index) => [
    (index * 47) % 256,
    (index * 89) % 256,
    (index * 131) % 256,
  ]);

  test("limits the palette and returns valid structured output", async () => {
    const image = await createPreprocessedColorGrid(manyColors);

    const result = await reduceColors(image, { maxColors: 8 });

    expect(result.width).toBe(image.width);
    expect(result.height).toBe(image.height);
    expect(result.palette.length).toBeLessThanOrEqual(8);
    expect(result.colorIndexes).toHaveLength(image.width * image.height);
    expect(
      result.colorIndexes.every(
        (index) =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < result.palette.length,
      ),
    ).toBe(true);
  });

  test("preserves an image that already has fewer colors than the limit", async () => {
    const colors = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ];
    const image = await createPreprocessedColorGrid(colors);

    const result = await reduceColors(image, { maxColors: 8 });

    expect(result.palette).toHaveLength(colors.length);
    expect(new Set(result.colorIndexes).size).toBe(colors.length);
  });

  test("produces deterministic palette and indexes", async () => {
    const image = await createPreprocessedColorGrid(manyColors);

    const first = await reduceColors(image, { maxColors: 16 });
    const second = await reduceColors(image, { maxColors: 16 });

    expect(first).toEqual(second);
  });

  test.each([undefined, 10])(
    "rejects an unsupported maxColors value: %s",
    async (maxColors) => {
      const image = await createPreprocessedColorGrid(manyColors);

      await expect(reduceColors(image, { maxColors })).rejects.toThrow(
        "maxColors must be one of: 8, 16, 24, 32, 48.",
      );
    },
  );
});
