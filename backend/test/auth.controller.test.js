require("dotenv").config({ path: [".env.test", ".env"] });

const prisma = require("../src/config/prismaClient");
const httpMocks = require("node-mocks-http");
const { EventEmitter } = require("events");

const waitForRouteHandler = require("./waitForRouteHandler");

const { registerUser, loginUser } = require("../src/controllers/auth.controller");

let respObj = null;

beforeAll(async () => {
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe("1) User registration", () => {
  test("1.1) User can successfully register.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        userName: "test",
        email: "tester@example.com",
        password: "Test1234!",
      },
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    await waitForRouteHandler(registerUser, req, respObj);

    const data = respObj._getJSONData();

    expect(respObj.statusCode).toBe(201);
    expect(data.user.email).toBe("tester@example.com");
    expect(data.user.userName).toBe("test");
  });

  test("1.2) Registration rejects an already registered email.", async () => {
    await prisma.user.create({
      data: {
        userName: "existingUser",
        email: "existing@example.com",
        hashedPassword: "Hash-password",
      },
    });

    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        userName: "newUser",
        email: "existing@example.com",
        password: "Test1234!",
      },
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    try {
      await waitForRouteHandler(registerUser, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("This email is already taken.");
    }
  });
});

describe("2) User login", () => {
  test("2.1) User can successfully log in.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "tester@example.com",
        password: "Test1234!",
      },
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    await waitForRouteHandler(loginUser, req, respObj);

    const data = respObj._getJSONData();

    expect(respObj.statusCode).toBe(200);
    expect(data.user.email).toBe("tester@example.com");
    expect(data.user.userName).toBe("test");
  });

  test("2.2) Login rejects an incorrect password.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "tester@example.com",
        password: "WrongPassword1!",
      },
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    try {
      await waitForRouteHandler(loginUser, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid credentials");
    }
  });

  test("2.3) Login rejects a nonexistent email.", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        email: "doesnotexist@example.com",
        password: "Test1234!",
      },
    });

    respObj = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    try {
      await waitForRouteHandler(loginUser, req, respObj);
    } catch (error) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid credentials");
    }
  });

});