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
let respObj = null;

beforeAll(async () => {
  // Clear test db of all users and patterns
  await prisma.user.deleteMany();
  await prisma.pattern.deleteMany();

  // Create dummy user
  user1 = await prisma.user.create({
    data: {
      email: "janedoe@gmail.com",
      userName: "janeKey",
      hashedPassword: "narnia",
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
    console.log(respObj._getJSONData());
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

    expect.assertions(1);

    await waitForRouteHandler(createPattern, req, respObj);
    expect(respObj.statusCode).toBe(400);
  });
});

describe("2) Reading patterns from the database.", () => {
  test("2.1) user1 successfully retrieves pattern from table.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "GET",
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

    expect.assertions(1);

    await waitForRouteHandler(createPattern, req, respObj);
    expect(respObj.statusCode).toBe(400);
  });
});

describe("Updating pattern names in the database.", () => {
  test("1. user1 can read the name of their first pattern.", async () => {
    expect.assertions(1);
  });
});

describe("Deleting pattern names in the database.", () => {
  test("1. user1 can delete their pattern.", async () => {
    expect.assertions(1);
  });
});

describe("Reading all patterns from a given user", () => {
  test("1. user1 can read all of their retrieved patterns.", async () => {
    expect.assertions(1);
  });
});
