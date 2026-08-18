const prisma = require("../config/prismaClient");
const { StatusCodes } = require("http-status-codes");

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

module.exports = { deleteUser };
