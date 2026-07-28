// Imports
const { StatusCodes } = require("http-status-codes");
const prisma = require("../config/prismaClient");

async function createPattern(req, res) {
  // Assumptions:
  //  - User id is stored in req.user.id
  //  - All relevant parameters are named accordingly in req.body

  return;
}

async function getPattern(req, res, next) {
  // Assumptions:
  //  - User id is stored in req.user.id

  const patternId = req.params?.id;

  // Bad request if patternId is null
  if (!patternId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "This is an invalid pattern ID" });
  }

  try {
    // Query for pattern using patternId and userId
    const pattern = await prisma.pattern.findUnique({
      where: {
        id: patternId,
        userId: req.user.id,
      },
      select: {
        id: true,
        patternName: true,
        patternImgUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If no pattern found, findUnique will return null
    if (pattern === null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "This pattern was not found." });
    }

    // Send successful response to server
    return res.status(StatusCodes.OK).json({ userPattern: pattern });
  } catch (error) {
    // Prisma error code for record not found
    if (error.code === "P2025") {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "This pattern was not found." });
    }

    // Global error handler
    next(error);
  }
}

async function deletePattern(req, res) {
  // Assumptions:
  //  - User id is stored in req.user.id
  return;
}

async function updatePattern(req, res) {
  return;
}

async function getAllUserPatterns(req, res) {
  // Assumptions:
  //  - User id is stored in req.user.id
  const userPatterns = await prisma.pattern.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      patternName: true,
      patternImgUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(StatusCodes.OK).json({
    patterns: userPatterns,
  });
}

module.exports = {
  getAllUserPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
};
