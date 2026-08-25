async function getUser() {
  const response = await fetch("/api/user/profile", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get user's profile");
  }

  return data.user;
}

async function updateUser(userData) {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user's profile");
  }

  return data.user;
}

async function deleteUser() {
  const response = await fetch("/api/user/profile", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }

  return response.json();
}

export { getUser, updateUser, deleteUser };
