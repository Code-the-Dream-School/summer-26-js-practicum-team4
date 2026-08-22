async function verifyReCaptchaToken(token) {
  if (typeof token !== "string" || !token.trim()) {
    return false;
  }
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
    if (!response.ok) {
      throw new Error(
        `Request to verify reCaptcha failed. Error: ${response.status}`,
      );
    }
    const data = await response.json();
    return data.success;
  } catch (error) {
    throw new Error(`reCAPTCHA verification failed: ${error.message}`);
  }
}

module.exports = { verifyReCaptchaToken };
