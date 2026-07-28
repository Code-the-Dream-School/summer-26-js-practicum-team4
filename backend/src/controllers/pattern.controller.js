// Imports
const { StatusCodes } = require("http-status-codes");
const prisma = require("../config/prismaClient");

async function getAllUserPatterns(req, res) {
  // Assumes userId is stored in req.user
  const userPatterns = await prisma.pattern.findMany({
    where: { userId: 1 },
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
};
