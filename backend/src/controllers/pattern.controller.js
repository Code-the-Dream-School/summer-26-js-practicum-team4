// Package Imports
const { StatusCodes } = require("http-status-codes");
const prisma = require("../config/prismaClient");

// Function Imports
const {
  generatePattern: generatePatternPipeline,
} = require("../services/pattern-pipeline.service");

// Error handler Imports
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");

const {
  patternSchema,
  patternUpdateSchema,
  patternGenerationSchema,
} = require("../validation/patternSchema");

function jsonToParsed(patternData) {
  // Returns three objects: original palette JSON, original grid JSON,
  // and new patternData object where palette and grid have been parsed
  return (
    patternData.palette,
    patternData.grid,
    {
      ...patternData,
      palette: JSON.parse(patternData.palette),
      grid: JSON.parse(patternData.grid),
    }
  );
}

function parsedToJson(validatedData, patternJson, gridJson) {
  return { ...validatedData, pattern: patternJson, grid: gridJson };
}

async function createPattern(req, res, next) {
  try {
    if (!req.body) {
      req.body = {};
    }

    // Parse JSON arguments from req.body
    const paletteJson,
      gridJson,
      parsedBody = jsonToParsed(req.body);

    // Use Joi Validation schema to ensure properly formed input
    const { error, value } = patternSchema.validate(parsedBody, {
      abortEarly: false,
    });

    if (error) {
      throw new BadRequestError("The input Pattern information is malformed.");
    }

    // value contains: patternName, stitchWidth, stitchHeight, palette, grid
    const createdPattern = await prisma.pattern.create({
      data: {
        ...parsedToJson(value, paletteJson, gridJson),
        userId: req.user.userId,
      },
      select: {
        id: true,
        patternName: true,
        originalImgUrl: true,
        patternImgUrl: true,
        createdAt: true,
      },
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ data: { pattern: createdPattern } });
  } catch (error) {
    // Send to global error handler
    console.log(error.message);
    next(error);
  }
}

async function getPattern(req, res, next) {
  const patternId = Number(req.params?.id);

  try {
    if (!patternId) {
      throw new BadRequestError("An invalid pattern ID was provided.");
    }

    const obtainedPattern = await prisma.pattern.findUnique({
      where: {
        id: patternId,
        userId: req.user.userId,
      },
      select: {
        id: true,
        userId: true,
        patternName: true,
        patternImgUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (obtainedPattern === null) {
      throw new NotFoundError(
        "The pattern you are looking for cannot be found. ",
      );
    }

    return res
      .status(StatusCodes.OK)
      .json({ data: { pattern: obtainedPattern } });
  } catch (error) {
    // Global error handler
    next(error);
  }
}

async function deletePattern(req, res, next) {
  try {
    const patternId = Number(req.params?.id);

    if (!patternId) {
      throw new BadRequestError("An invalid pattern ID was provided.");
    }

    const deletedPattern = await prisma.pattern.delete({
      where: {
        id: patternId,
        userId: req.user.userId,
      },
      select: {
        id: true,
        userId: true,
        patternName: true,
        patternImgUrl: true,
      },
    });

    return res
      .status(StatusCodes.OK)
      .json({ data: { pattern: deletedPattern } });
  } catch (error) {
    // Prisma not found error
    if (error.code === "P2025") {
      const prismaError = new NotFoundError("Pattern was not found.");
      next(prismaError);
      return;
    }

    // Call global error handler
    next(error);
  }
}

async function updatePattern(req, res, next) {
  try {
    const patternId = Number(req.params?.id);

    if (!patternId) {
      throw new BadRequestError("This is an invalid pattern ID.");
    }

    // Use Joi Validation schema to ensure patch request is properly formed
    const { error, value } = patternUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new BadRequestError("The input pattern data is malformed.");
    }

    const updatedPattern = await prisma.pattern.update({
      data: value,
      where: {
        id: patternId,
        userId: req.user.userId,
      },
      select: {
        id: true,
        userId: true,
        patternName: true,
        patternImgUrl: true,
        updatedAt: true,
      },
    });

    return res
      .status(StatusCodes.OK)
      .json({ data: { pattern: updatedPattern } });
  } catch (error) {
    // Prisma record not found error
    if (error.code === "P2025") {
      const prismaError = new NotFoundError("Pattern was not found.");
      next(prismaError);
      return;
    }

    next(error);
  }
}

async function getAllUserPatterns(req, res, next) {
  try {
    const userPatterns = await prisma.pattern.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        patternName: true,
        patternImgUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(StatusCodes.OK).json({
      data: {
        patterns: userPatterns,
      },
    });
  } catch (error) {
    // Send to global error handler
    next(error);
  }
}

async function generatePattern(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image using the image field.",
      });
    }

    const { error, value } = patternGenerationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message:
          "Provide exactly one valid stitch dimension (width or height) between 10 and 200.",
      });
    }

    const { pattern } = await generatePatternPipeline(req.file.buffer, value);

    return res.status(200).json({ data: { pattern } });
  } catch (error) {
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
