const { userSchema } = require("../src/validation/userSchema");
const validate = require("../src/middleware/validate");

describe("1) User registration validation", () => {
  test("1.1) Registration accepts valid user data.", () => {
    const req = {
      body: {
        userName: "test",
        email: "valid@example.com",
        password: "Test1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("1.2) Registration rejects a password shorter than 8 characters.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester@example.com",
        password: "Test1!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must be at least 8 characters long.",
    );
  });

  test("1.3) Registration rejects a password longer than 100 characters.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester7@example.com",
        password: `Test1${"!".repeat(96)}`,
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must be no more than 100 characters long.",
    );
  });

  test("1.4) Registration rejects a password missing an uppercase letter.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester2@example.com",
        password: "test1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    );
  });

  test("1.5) Registration rejects a password missing a lowercase letter.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester3@example.com",
        password: "TEST1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    );
  });

  test("1.6) Registration rejects a password missing a number.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester4@example.com",
        password: "Testing!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    );
  });

  test("1.7) Registration rejects a password missing a special character.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester5@example.com",
        password: "Test1234",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    );
  });

  test("1.8) Registration rejects a password containing spaces.", () => {
    const req = {
      body: {
        userName: "test",
        email: "tester6@example.com",
        password: "Test 1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      "Password must contain uppercase letter, lowercase letter, number, special character, and no spaces.",
    );
  });

  test("1.9) Registration rejects an invalid email.", () => {
    const req = {
      body: {
        userName: "test",
        email: "invalid-email",
        password: "Test1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('"email" must be a valid email');
  });

  test("1.10) Registration rejects a username shorter than 3 characters.", () => {
    const req = {
      body: {
        userName: "ab",
        email: "username1@example.com",
        password: "Test1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      '"userName" length must be at least 3 characters long',
    );
  });

  test("1.11) Registration rejects a username longer than 30 characters.", () => {
    const req = {
      body: {
        userName: "a".repeat(31),
        email: "username2@example.com",
        password: "Test1234!",
      },
    };

    const next = jest.fn();

    validate(userSchema)(req, {}, next);

    const error = next.mock.calls[0][0];

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe(
      '"userName" length must be less than or equal to 30 characters long',
    );
  });
});