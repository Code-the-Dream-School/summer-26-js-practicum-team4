async function register(username: string, email: string, password: string) {
    console.log({ username, email, password });
  return fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    });
}


async function login(email: string, password: string) {
    console.log({ email, password });
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    });
}


export { register, login };
