const sharp = require("sharp");

const {
  preprocessImage,
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
