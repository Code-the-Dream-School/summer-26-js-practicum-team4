async function getUser() {
  const response = await fetch("/api/profile", {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get user profile");
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

export { getUser, deleteUser };

