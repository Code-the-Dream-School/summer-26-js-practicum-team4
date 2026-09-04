const { EventEmitter } = require("events");
const httpMocks = require("node-mocks-http");

jest.mock("../src/services/pattern-pipeline.service", () => ({
  generatePattern: jest.fn(),
}));

const {
  generatePattern: generatePatternPipeline,
} = require("../src/services/pattern-pipeline.service");
const {
  generatePattern: generatePatternController,
} = require("../src/controllers/pattern.controller");
const waitForRouteHandler = require("./waitForRouteHandler");

const pattern = {
  width: 20,
  height: 10,
  palette: [
    {
      dmcCode: "310",
      name: "Black",
      r: 0,
      g: 0,
      b: 0,
      symbol: "A",
    },
  ],
  grid: Array(200).fill(0),
};

function createRequest(body = {}, includeImage = true) {
  return httpMocks.createRequest({
    method: "POST",
    body,
    file: includeImage
      ? { buffer: Buffer.from("uploaded image"), mimetype: "image/png" }
      : undefined,
  });
}

function createResponse() {
  return httpMocks.createResponse({ eventEmitter: EventEmitter });
}

beforeEach(() => {
  generatePatternPipeline.mockReset();
  generatePatternPipeline.mockResolvedValue({
    pattern,
    preview: { buffer: Buffer.from("preview") },
    chart: { buffer: Buffer.from("chart") },
  });
});

describe("generatePattern controller", () => {
  test("generates pattern data from an uploaded image and width", async () => {
    const req = createRequest({ width: "20" });
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(generatePatternPipeline).toHaveBeenCalledWith(req.file.buffer, {
      width: 20,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ data: { pattern } });
  });

  test("generates pattern data when height is provided instead", async () => {
    const req = createRequest({ height: "10" });
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(generatePatternPipeline).toHaveBeenCalledWith(req.file.buffer, {
      height: 10,
    });
    expect(res.statusCode).toBe(200);
  });

  test("rejects a request without an image", async () => {
    const req = createRequest({ width: "20" }, false);
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(res.statusCode).toBe(400);
    expect(generatePatternPipeline).not.toHaveBeenCalled();
  });

  test.each([
    ["neither dimension", {}],
    ["both dimensions", { width: "20", height: "10" }],
    ["a dimension below the supported range", { width: "9" }],
    ["a non-integer dimension", { height: "10.5" }],
    ["a public maxColors field", { width: "20", maxColors: "16" }],
  ])("rejects %s", async (description, body) => {
    const req = createRequest(body);
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(res.statusCode).toBe(400);
    expect(generatePatternPipeline).not.toHaveBeenCalled();
  });

  test("does not return successful pattern data when processing fails", async () => {
    generatePatternPipeline.mockRejectedValue(new Error("Processing failed"));
    const req = createRequest({ width: "20" });
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: "Unable to generate the pattern.",
    });
  });

  test("returns a helpful message when the calculated dimension is unsupported", async () => {
    const dimensionError = new Error(
      "resolved width must be an integer between 10 and 200.",
    );
    dimensionError.code = "PATTERN_DIMENSION_OUT_OF_RANGE";
    dimensionError.suppliedDimensionName = "height";
    generatePatternPipeline.mockRejectedValue(dimensionError);
    const req = createRequest({ height: "10" });
    const res = createResponse();

    await waitForRouteHandler(generatePatternController, req, res);

    expect(res.statusCode).toBe(422);
    expect(res._getJSONData()).toEqual({
      message:
        "This size is too small for this image. Try increasing the height for a clearer, better-proportioned pattern.",
    });
  });
});
