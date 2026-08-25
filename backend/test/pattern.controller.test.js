// ======== Imports ======== //

// dotenv to get db url from .env.test and other variables from .env
require("dotenv").config({ path: [".env.test", ".env"] });

// imports to facilitate db interaction
const prisma = require("../src/config/prismaClient");
const httpMocks = require("node-mocks-http");

// utility function to await completion of route handlers
const waitForRouteHandler = require("./waitForRouteHandler");

// EventEmitter class for response objects to emit signals (e.g. finish)
const { EventEmitter } = require("events");

// Controller function imports
const {
  getAllUserPatterns,
  getAllPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
  createMultiplePatterns,
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
  test("1.1) User1 can successfully create a pattern.", async () => {
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

    expect.assertions(1);

    // Use try/catch block to catch thrown error
    try {
      await waitForRouteHandler(createPattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(400);
    }
  });
});

describe("2) Reading patterns from the database.", () => {
  test("2.1) User1 can retrieve their created pattern from db.", async () => {
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
  test("2.2) Finding no pattern yields a NotFoundError", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "GET",
      params: { id: patternId + 1 },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);
    try {
      await waitForRouteHandler(getPattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
  test("2.3) User2 searching for a User1 pattern will result in a NotFoundError", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user2.id },
      method: "GET",
      params: { id: patternId },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);

    try {
      await waitForRouteHandler(getPattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
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
  test("3.2) Incorrect body results in BadRequestError", async () => {
    const newPatName = "PatUpdate";
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "PATCH",
      params: { id: patternId },
      body: { incorrectKey: newPatName },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);

    try {
      await waitForRouteHandler(updatePattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(400);
    }
  });
  test("3.3) If a pattern is not found in the db, a NotFoundError is returned.", async () => {
    const newPatName = "PatUpdate";
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "PATCH",
      params: { id: patternId + 1 },
      body: { patternName: newPatName },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);
    try {
      await waitForRouteHandler(updatePattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
  test("3.4) User2 attempting to update a user1 pattern results in a NotFoundError", async () => {
    const newPatName = "PatUpdate";
    const req = httpMocks.createRequest({
      user: { userId: user2.id },
      method: "PATCH",
      params: { id: patternId },
      body: { patternName: newPatName },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);
    try {
      await waitForRouteHandler(updatePattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
});

describe("4) Deleting pattern names in the database.", () => {
  test("4.1) A NotFoundError is returned if pattern is not found in table.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user2.id },
      method: "DELETE",
      params: { id: patternId },
    });

    // Create instance of save response
    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    expect.assertions(1);
    try {
      await waitForRouteHandler(deletePattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
  test("4.2) user1 can delete their pattern.", async () => {
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
  test("4.3) A NotFoundError is returned if pattern is not found in table.", async () => {
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
    try {
      await waitForRouteHandler(deletePattern, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
});

describe("5) Creating multiple patterns for a given user", () => {
  test("5.1) User 2 is able to create multiple patterns.", async () => {
    const req = httpMocks.createRequest({
      user: { userId: user2.id },
      method: "POST",
      body: [
        {
          patternName: "Josh",
          originalImgUrl:
            "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
          patternImgUrl:
            "https://www.preciouscore.com/wp-content/uploads/2025/07/Bone-In-Ribeye-Steak.jpg",
        },
        {
          patternName: "Blocks",
          originalImgUrl:
            "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
          patternImgUrl: "https://m.media-amazon.com/images/I/61KXoHkB-hL.jpg",
        },
        {
          patternName: "Heights",
          originalImgUrl:
            "https://www.reddit.com/r/catpictures/comments/1v91sns/mommy_is_tired/#lightbox",
          patternImgUrl:
            "https://skinnyms.com/wp-content/uploads/2015/09/Savory-Lemon-White-Fish-Fillets.jpg",
        },
      ],
    });

    let respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    // Create all three entries for user 2 and verify length
    await waitForRouteHandler(createMultiplePatterns, req, respObj);

    respData = respObj._getJSONData();

    // Ensure OK response and that the length of patterns array is 2.
    expect.assertions(2);

    expect(respObj.statusCode).toBe(201);
    expect(respData.data.patterns.length).toBe(3);
  });
});

describe("6) Reading all patterns from a given user", () => {
  test("6.1) user1 receives Empty list of patterns", async () => {
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
    const patternList = respObj._getJSONData().data.patterns;
    expect(patternList.length).toBe(0);
  });
  test("6.2) user1 can read all of their retrieved patterns.", async () => {
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

describe("7) Retrieving all patterns from every user", () => {
  test("7.1) If two users create patterns, any given user can retrieve all patterns", async () => {
    // Create req and res for retrieving all patterns
    const req = httpMocks.createRequest({
      user: { userId: user1.id },
      method: "GET",
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    // Make request and verify output
    await waitForRouteHandler(getAllPatterns, req, respObj);
    respData = respObj._getJSONData();

    // Ensure OK response and that the length of patterns array is 3.
    expect.assertions(2);

    expect(respObj.statusCode).toBe(200);
    expect(respData.data.patterns.length).toBe(6);
  });
});
