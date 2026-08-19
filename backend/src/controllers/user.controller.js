const prisma = require("../config/prismaClient");
const { StatusCodes } = require("http-status-codes");

const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        userName: true,
        email: true,
        // userProfileImgUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthenticatedError("User profile not found");
    }
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res,next) => {
 try{ await prisma.user.delete({
    where: { id: req.user.userId },
  });
  res.clearCookie("token");
  return res.status(StatusCodes.OK).json({
    message: "User deleted successfully.",
  });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUser, deleteUser };