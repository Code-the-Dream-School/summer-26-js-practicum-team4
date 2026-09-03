const prisma = require("../config/prismaClient");
const { StatusCodes } = require("http-status-codes");
const { userUpdateSchema } = require("../validation/userSchema");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcrypt");

const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        userName: true,
        email: true,
        userProfileImgUrl: true,
        hashedPassword: true,
        createdAt: true,
        _count: {
          select: { patterns: true },
        },
      },
    });

    if (!user) {
      throw new UnauthenticatedError("User profile not found");
    }
    const hasPassword = user.hashedPassword ? true : false;
    delete user.hashedPassword;

    const safeUser = { ...user, hasPassword };

    return res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { hashedPassword: true },
    });

    if (!user) {
      throw new UnauthenticatedError("User profile not found");
    }

    const { error, value } = userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    // Password update logic for users with existing passwords
    if (user.hashedPassword && value.oldPassword && value.newPassword) {
      if (value.oldPassword === value.newPassword) {
        throw new BadRequestError("Old and new password should be different");
      }

      const passwordMatches = await bcrypt.compare(
        value.oldPassword,
        user.hashedPassword,
      );

      if (!passwordMatches) {
        throw new BadRequestError("Incorrect password");
      } else {
        const hashedPassword = await bcrypt.hash(value.newPassword, 10);
        value.hashedPassword = hashedPassword;
        delete value.oldPassword;
        delete value.newPassword;
      }
    } else if (
      user.hashedPassword &&
      (value.oldPassword || value.newPassword)
    ) {
      throw new BadRequestError("Both passwords are required");
    }

    //  Password create logic for Google users without a password
    if (!user.hashedPassword && value.newPassword) {
      const hashedPassword = await bcrypt.hash(value.newPassword, 10);
      value.hashedPassword = hashedPassword;
      delete value.newPassword;
    }

    // Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { ...value },
      select: {
        id: true,
        userName: true,
        email: true,
        userProfileImgUrl: true,
        createdAt: true,
        hashedPassword: true,
        _count: {
          select: { patterns: true },
        },
      },
    });

    const hasPassword = updatedUser.hashedPassword ? true : false;
    delete updatedUser.hashedPassword;
    const safeUser = { ...updatedUser, hasPassword };
    return res.status(StatusCodes.OK).json({ user: safeUser });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({
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

module.exports = { getUser, deleteUser, updateUser };
