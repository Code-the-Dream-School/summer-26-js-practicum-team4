module.exports = async function waitForRouteHandler(routeHandler, req, res) {
  let next;
  // Create promise which only resolves if routeHandler completes its process or next is called
  const promise = new Promise((resolve, reject) => {
    // Create mock next to process error and display messages in tester file.
    next = jest.fn((error) => {
      // Reject promise if error encountered; otherwise, resolve upon next function's termination
      if (error) {
        return reject(error);
      }

      resolve();
    });

    // If no error encountered, resolve on finish condition
    res.on("finish", () => {
      resolve();
    });
  });

  // Use routeHandler to modify res, await promise, and return next for final resolution of this wait.
  await routeHandler(req, res, next);
  await promise;
  return next;
};
