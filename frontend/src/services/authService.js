async function register(username, email, password, reCaptchaToken) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      userName: username,
      email,
      password,
      reCaptchaToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

async function login(email, password) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

async function getCurrentUser() {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Failed to get current user");
    error.status = response.status;
    throw error;
  }

  return data.user;
}

async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to logout");
  }

  return data;
}

async function googleAuth(googleToken) {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      googleToken,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data.user;
}
export { register, login, getCurrentUser, logout, googleAuth };
