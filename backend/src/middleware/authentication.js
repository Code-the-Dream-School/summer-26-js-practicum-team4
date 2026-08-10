const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
     new UnauthenticatedError('Authentication invalid')
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId
    };

    next();
  } catch (error) {
    return next(
     new UnauthenticatedError('Authentication invalid')
    );
  }
};

module.exports = authenticationMiddleware;
