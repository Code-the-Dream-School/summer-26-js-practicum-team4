const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const prisma = require('../config/prismaClient');
const { BadRequestError, ConflictError } = require('../errors');

const generateToken = (userId, userName) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_LIFETIME || '7d';

  return jwt.sign({ userId, userName }, secret, { expiresIn });
};

/* REGISTER USER */
const registerUser = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const userNameNormalized =
      typeof userName === 'string' ? userName.trim() : '';

    const emailNormalized =
      typeof email === 'string' ? email.toLowerCase().trim() : '';

    if (!userNameNormalized || !emailNormalized || !password) {
      throw new BadRequestError('userName, email and password are required');
    }

    // Check if the email is already registered
    const emailTaken = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });

    if (emailTaken) {
      throw new ConflictError('This email is already taken.');
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
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(StatusCodes.CREATED).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
