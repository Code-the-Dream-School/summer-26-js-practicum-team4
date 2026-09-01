const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
);

const verifyGoogleIdToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub: googleId,
      email,
      name: userName,
      picture: userProfileImgUrl,
    } = payload;

    return { googleId, email, userName, userProfileImgUrl };
  } catch (error) {
    throw new Error(`Google verification failed: ${error.message}`);
  }
};

module.exports = { verifyGoogleIdToken };
