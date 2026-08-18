async function verifyReCaptchaToken(token) {
  const params = new URLSearchParams({
    response: token,
    secret: process.env.RECAPTCHA_SECRET_KEY,
  });
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      },
    );
    const data = await response.json();

    return data.success;
  } catch (error) {
    return false;
  }
}

module.exports = { verifyReCaptchaToken };
