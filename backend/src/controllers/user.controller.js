const prisma = require("../config/prismaClient");
const { StatusCodes } = require("http-status-codes");

const getUser = (req, res) => {};
const updateUser = (req, res) => {};

const deleteUser = async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.userId },
  });
  res.clearCookie("token");
  return res.status(StatusCodes.OK).json({
    message: "User deleted successfully.",
  });
};

module.exports = { getUser, updateUser, deleteUser };
