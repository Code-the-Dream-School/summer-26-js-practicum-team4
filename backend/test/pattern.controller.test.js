// ======== Imports ======== //

// dotenv to get db url from .env.test and other variables from .env
require("dotenv").config({ path: [".env.test", ".env"] });

// imports to facilitate db interaction
const prisma = require("../src/config/prismaClient");
const httpMocks = require("node-mocks-http");

// utility function to await completion of route handlers
const waitForRouteHandler = require("./waitForRouteHandler");

// EventEmitter class for response objects to emit signals (e.g. finish)
const { EventEmitter } = require("pg-cursor");

// Controller function imports
const {
  getAllUserPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
} = require("../src/controllers/pattern.controller");

// Global Variables
let user1 = null;
let user2 = null;
let respObj = null;
let patternId = null;

beforeAll(async () => {
  // Clear test db of all users and patterns
  await prisma.user.deleteMany();
  await prisma.pattern.deleteMany();

  // Create dummy users
  user1 = await prisma.user.create({
    data: {
      email: "janedoe@gmail.com",
      userName: "janeKey",
      hashedPassword: "narnia",
    },
  });

  user2 = await prisma.user.create({
    data: {
      email: "johndoe@gmail.com",
      userName: "johnKey",
      hashedPassword: "narniooooooh",
    },
  });
});

// Disconnect prisma after all operations
afterAll(() => {
  prisma.$disconnect();
});

// Begin testing
describe("1) Creating patterns in the database.", () => {
  test("1.1) Pattern successfully created", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "POST",
      body: {
        patternName: "Cat Image to Dog Pattern",
        originalImgUrl:
          "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
        patternImgUrl:
          "https://www.reddit.com/r/dogpictures/comments/1v8yrm5/sweet_girl_trixi/#lightbox",
      },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);
    await waitForRouteHandler(createPattern, req, respObj);

    // Save patternId for future test use
    patternId = respObj._getJSONData().data.pattern.id;
    expect(respObj.statusCode).toBe(201);
  });
  test("1.2) Patterns missing any required fields results in a BadRequestError.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "POST",
      body: {
        patternName: "Cat Image to Dog Pattern",
        originalImgUrl:
          "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
      },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    // expect.assertions(1);

    // await waitForRouteHandler(createPattern, req, respObj);
    // expect(respObj.statusCode).toBe(400);
  });
});

describe("2) Reading patterns from the database.", () => {
  test("2.1) user1 successfully retrieves pattern from table.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "GET",
      params: { id: patternId },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);

    await waitForRouteHandler(getPattern, req, respObj);
    expect(respObj.statusCode).toBe(200);
  });
  // test("2.2) Finding no pattern yields a NotFoundError", async () => {});
  // test("2.3) A user searching for a pattern that doesn't belong to them results in a NotFoundError", async () => {});
});

describe("3) Updating pattern names in the database.", () => {
  test("3.1) user1 can update the name of their first pattern.", async () => {
    const newPatName = "PatUpdate";
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "PATCH",
      params: { id: patternId },
      body: { patternName: newPatName },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(2);
    await waitForRouteHandler(updatePattern, req, respObj);

    const respData = respObj._getJSONData();

    expect(respObj.statusCode).toBe(200);
    expect(respData.data.pattern.patternName).toBe(newPatName);
  });
  // test("3.2) Incorrect body results in BadRequestError", async () => {});
  // test("3.3) If a pattern is not found in the db, a NotFoundError is returned.", async () => {});
});

describe("4) Deleting pattern names in the database.", () => {
  test("4.1) user1 can delete their pattern.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "DELETE",
      params: { id: patternId },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);

    await waitForRouteHandler(deletePattern, req, respObj);
    expect(respObj.statusCode).toBe(200);
  });
  // test("4.2) A NotFoundError is returned if pattern is not found in table.", async () => {});
});

describe("Reading all patterns from a given user", () => {
  test("1. user1 can read all of their retrieved patterns.", async () => {
    // Create request and responses for creating database entries
    const req1 = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "POST",
      body: {
        patternName: "Cat Image to Dog Pattern",
        originalImgUrl:
          "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
        patternImgUrl:
          "https://www.reddit.com/r/dogpictures/comments/1v8yrm5/sweet_girl_trixi/#lightbox",
      },
    });

    const req2 = httpMocks.createRequest({
      user: { userId: user2.id },
      method: "POST",
      body: {
        patternName: "Locust",
        originalImgUrl:
          "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
        patternImgUrl:
          "https://www.reddit.com/r/dogpictures/comments/1v8yrm5/sweet_girl_trixi/#lightbox",
      },
    });

    // Create multiple mock responses

    let respObj1 = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    let respObj2 = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    let respObj3 = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    // Create two database entries for user1 and one db entry for user 2
    await waitForRouteHandler(createPattern, req1, respObj1);
    await waitForRouteHandler(createPattern, req1, respObj2);

    await waitForRouteHandler(createPattern, req2, respObj3);

    // Create req and res for retrieving user1 patterns
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "GET",
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    // Make request and verify output
    await waitForRouteHandler(getAllUserPatterns, req, respObj);
    respData = respObj._getJSONData();

    // Ensure OK response and that the length of patterns array is 2.
    expect.assertions(2);

    expect(respObj.statusCode).toBe(200);
    expect(respData.data.patterns.length).toBe(2);
  });
});
