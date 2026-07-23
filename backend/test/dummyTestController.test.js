const sum = require("../src/controllers/dummyTestController");

test("adds 1 + 2 equals to 3", () => {
  expect(sum(1, 2)).toBe(3);
});
