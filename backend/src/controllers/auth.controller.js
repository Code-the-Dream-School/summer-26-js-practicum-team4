const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const prisma = require("../config/prismaClient");
const {
  BadRequestError,
  ConflictError,
  UnauthenticatedError,
} = require("../errors");
const { verifyReCaptchaToken } = require("../services/recaptcha.service");

const {
  verifyGoogleIdToken,
} = require("../services/verifyGoogleIdToken.service");

const generateToken = (userId, userName) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_LIFETIME || "7d";

  return jwt.sign({ userId, userName }, secret, { expiresIn });
};

/* REGISTER USER */
const registerUser = async (req, res, next) => {
  try {
    const { userName, email, password, reCaptchaToken } = req.body;

    const userNameNormalized =
      typeof userName === "string" ? userName.trim() : "";

    const emailNormalized =
      typeof email === "string" ? email.toLowerCase().trim() : "";

    if (!userNameNormalized || !emailNormalized || !password) {
      throw new BadRequestError("userName, email and password are required");
    }

    if (!reCaptchaToken) {
      throw new BadRequestError("reCAPTCHA  is required");
    }

    const isPerson = await verifyReCaptchaToken(reCaptchaToken);
    if (!isPerson) {
      throw new BadRequestError("reCAPTCHA verification failed");
    }

    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      throw new ConflictError(
        existingUser.googleId
          ? "This account was created with Google. Please sign in with Google and set a password in your profile to log in with your email and password."
          : "This email is already taken.",
      );
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and return only safe fields
    const user = await prisma.user.create({
      data: {
        userName: userNameNormalized,
        email: emailNormalized,
        hashedPassword,
      },
      select: {
        id: true,
        userName: true,
        email: true,
      },
    });

    const token = generateToken(user.id, user.userName);

    // Log the user in after registration
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};

/*Login user */

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const emailNormalized =
      typeof email === "string" ? email.toLowerCase().trim() : "";

    if (!emailNormalized || !password) {
      throw new BadRequestError("Email and password are required");
    }

    /* Find the user by email */
    const user = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    if (!user.hashedPassword) {
      throw new UnauthenticatedError(
        "This account was created with Google. Please sign in with Google and set a password in your profile to log in with your email and password.",
      );
    }

    /* Compare the password with the saved hash */
    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatches) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const token = generateToken(user.id, user.userName);

    // Log the user in
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* GET CURRENT USER */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        userName: true,
        email: true,
      },
    });

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

/* LOGOUT USER */
const logoutUser = (req, res) => {
  res.clearCookie("token");

  return res.status(StatusCodes.OK).json({
    message: "Logged out successfully",
  });
};

/*AUtH USER with GOOGLE*/
const googleUserAuth = async (req, res, next) => {
  try {
    const googleToken = req.body?.googleToken;

    if (typeof googleToken !== "string" || !googleToken.trim()) {
      throw new BadRequestError("Google token is required");
    }

    const googleUser = await verifyGoogleIdToken(googleToken);

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email: googleUser.email },
          data: { googleId: googleUser.googleId },
          select: {
            id: true,
            userName: true,
            email: true,
          },
        });
      } else if (user.googleId !== googleUser.googleId) {
        throw new ConflictError(
          "This email is registered with other Google account",
        );
      }
    } else {
      user = await prisma.user.create({
        data: {
          userName: googleUser.userName,
          email: googleUser.email,
          googleId: googleUser.googleId,
          userProfileImgUrl: googleUser.userProfileImgUrl,
        },
        select: {
          id: true,
          userName: true,
          email: true,
        },
      });
    }

    const token = generateToken(user.id, user.userName);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.OK).json({
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleUserAuth,
  getCurrentUser,
  logoutUser,
};
