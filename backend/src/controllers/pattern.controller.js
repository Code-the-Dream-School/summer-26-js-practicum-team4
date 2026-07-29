// Package Imports
const { StatusCodes } = require("http-status-codes");
const prisma = require("../config/prismaClient");

// Function Imports
const {
  generatePatternImage,
} = require("../services/pattern-generator.service");

// Error handler Imports
const { BadRequestError, NotFoundError } = require("../errors");

const {
  patternSchema,
  patternUpdateSchema,
} = require("../validation/patternSchema");

async function createPattern(req, res, next) {
  // Assumptions:
  //  - User id is stored in req.user.id
  //  - All relevant parameters are named accordingly in req.body

  if (!req.body) {
    req.body = {};
  }

  // Use Joi Validation schema to ensure properly formed input
  const { error, value } = patternSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new BadRequestError("The input Pattern information is malformed.");
    return;
  }

  try {
    // Add patternName, originalImgUrl, and patternImgUrl into patterns table under appropriate userId (times are auto-generated)
    const createdPattern = await prisma.pattern.create({
      data: {
        ...value,
        userId: req.user.id,
      },
      select: {
        id: true,
        patternName: true,
        originalImgUrl: true,
        patternImgUrl: true,
        createdAt: true,
      },
    });

    return res.status(StatusCodes.OK).json({ pattern: createdPattern });
  } catch (error) {
    // Send to global error handler
    next(err);
  }
}

async function getPattern(req, res, next) {
  // Assumptions:
  //  - User id is stored in req.user.id

  const patternId = Number(req.params?.id);

  // Bad request if patternId is null
  if (!patternId) {
    throw new BadRequestError("An invalid pattern ID was provided.");
    return;
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
    return res.status(StatusCodes.OK).json({ pattern: pattern });
  } catch (error) {
    // Prisma error code for record not found
    if (error.code === "P2025") {
      throw new NotFoundError("This pattern was not found.");
    }

    // Global error handler
    next(error);
  }
}

async function deletePattern(req, res, next) {
  // Assumptions:
  //  - User id is stored in req.user.id

  const patternId = Number(req.params?.id);

  // Bad request if patternId is null
  if (!patternId) {
    throw new BadRequestError("An invalid pattern ID was provided.");
  }

  // Attempt deleting pattern
  try {
    const deletedPattern = await prisma.pattern.delete({
      where: {
        id: patternId,
        userId: req.user.id,
      },
      select: {
        id: true,
        patternName: true,
        patternImgUrl: true,
      },
    });

    // Return deleted pattern to server
    return res.status(StatusCodes.OK).json({ pattern: deletedPattern });
  } catch (error) {
    // Prisma not found error
    if (error.code === "P2025") {
      throw new NotFoundError("Pattern was not found.");
      return;
    }

    // Call global error handler
    next(error);
  }
}

async function updatePattern(req, res, next) {
  // Assumptions:
  //  - User id is stored in req.user.id
  const patternId = Number(req.params?.id);

  // Bad request if patternId is null
  if (!patternId) {
    throw new BadRequestError("This is an invalid pattern ID.");
    return;
  }

  // Use Joi Validation schema to ensure patch request is properly formed
  const { error, value } = patternUpdateSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    throw new BadRequestError("The input pattern data is malformed.");
    return;
  }

  // Update pattern in database
  try {
    const updatedPattern = await prisma.pattern.update({
      data: value,
      where: {
        id: patternId,
        userId: req.user.id,
      },
      select: {
        id: true,
        patternName: true,
        patternImgUrl: true,
        updatedAt: true,
      },
    });

    // Return updated pattern to user
    return res.status(StatusCodes.OK).json({ pattern: updatedPattern });
  } catch (error) {
    // Record not found error
    if (error.code === "P2025") {
      throw new NotFoundError("Pattern was not found.");
      return;
    }

    // Send error to global handler otherwise
    next(error);
  }
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

async function generatePattern(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image using the image field.",
      });
    }

    const requestedWidth = Number(req.body.width) || 50;
    const requestedHeight = Number(req.body.height) || 50;

    if (
      requestedWidth < 10 ||
      requestedWidth > 200 ||
      requestedHeight < 10 ||
      requestedHeight > 200
    ) {
      return res.status(400).json({
        message: "Pattern width and height must be between 10 and 200.",
      });
    }

    const pattern = await generatePatternImage(req.file.buffer, {
      width: requestedWidth,
      height: requestedHeight,
    });

    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", 'inline; filename="generated-pattern.png"');

    return res.status(200).send(pattern.buffer);
  } catch (error) {
    console.error("Pattern generation error:", error);

    return res.status(500).json({
      message: "Unable to generate the pattern.",
    });
  }
}

module.exports = {
  generatePattern,
  getAllUserPatterns,
  createPattern,
  getPattern,
  deletePattern,
  updatePattern,
};
