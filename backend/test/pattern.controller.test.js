// ======== Imports ======== //

// dotenv to get db url from .env.test and other variables from .env
require("dotenv").config({ path: [".env.test", ".env"] });

// imports to facilitate db interaction
const prisma = require("../src/config/prismaClient");
const httpMocks = require("node-mocks-http");

// utility function to await completion of route handlers
const waitForRouteHandler = require("./waitForRouteHandler");
