import React, { useRef, useState } from "react";
import LogoutBtn from "../components/features/auth/LogoutBtn";
import { deleteUser } from "../services/userService";
import { useAuth } from "../state/auth/useAuth";

function UserProfilePage() {
  const {
    dispatch,
    state: { loading },
  } = useAuth();

  const [user, setUser] = useState({
    fullName: "Millicent Traylor",
    email: "millicent@email.com",
    memberSince: "July 2026",
    profilePhoto: "",
  });

  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleEditProfile = () => {
    setFormData(user);
    setIsEditing(true);
    setMessage("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setMessage("Full name and email are required.");
      return;
    }

    setUser(formData);
    setIsEditing(false);
    setMessage("Profile updated successfully.");
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
    setMessage("");
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    const maximumFileSize = 2 * 1024 * 1024;

    if (selectedFile.size > maximumFileSize) {
      setMessage("Profile photo must be smaller than 2 MB.");
      return;
    }

    const imagePreviewUrl = URL.createObjectURL(selectedFile);

    setUser((previousUser) => ({
      ...previousUser,
      profilePhoto: imagePreviewUrl,
    }));

    setFormData((previousData) => ({
      ...previousData,
      profilePhoto: imagePreviewUrl,
    }));

    setMessage("Profile photo selected.");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangePassword = () => {
    setMessage("Change Password will be added in the next step.");
  };

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (confirmed) {
      dispatch({ type: "SET_LOADING" });

      try {
        await deleteUser();
        dispatch({ type: "LOGOUT" });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message,
        });
      }
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <section className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-6 shadow-md md:p-10">
        <h1 className="mb-8 text-center font-heading text-4xl font-bold text-secondary">
          User Profile
        </h1>

        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-background text-6xl">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={`${user.fullName}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span aria-hidden="true">👤</span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <button
            type="button"
            className="rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
            onClick={handleUploadButtonClick}
          >
            Upload Photo
          </button>

          <small className="text-sm text-text-secondary">
            JPG, PNG or WEBP. Maximum 2 MB.
          </small>
        </div>

        {message && (
          <p
            className="mb-6 rounded-lg border border-border bg-background px-4 py-3 text-center text-secondary"
            role="status"
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSaveProfile}>
          <section className="mb-8 space-y-4">
            <div className="grid gap-2 md:grid-cols-[140px_1fr] md:items-center">
              <label
                htmlFor="fullName"
                className="font-semibold text-secondary"
              >
                Full Name
              </label>

              {isEditing ? (
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              ) : (
                <span className="rounded-lg border border-border bg-background px-4 py-3 text-text">
                  {user.fullName}
                </span>
              )}
            </div>

            <div className="grid gap-2 md:grid-cols-[140px_1fr] md:items-center">
              <label htmlFor="email" className="font-semibold text-secondary">
                Email
              </label>

              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              ) : (
                <span className="rounded-lg border border-border bg-background px-4 py-3 text-text">
                  {user.email}
                </span>
              )}
            </div>

            <div className="grid gap-2 md:grid-cols-[140px_1fr] md:items-center">
              <span className="font-semibold text-secondary">Member Since</span>

              <span className="rounded-lg border border-border bg-background px-4 py-3 text-text">
                {user.memberSince}
              </span>
            </div>
          </section>

          {isEditing && (
            <div className="mb-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-lg bg-secondary px-6 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="rounded-lg border border-border bg-surface px-6 py-3 font-semibold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <section className="border-t border-border pt-6">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-secondary">
            Account Settings
          </h2>

          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleEditProfile}
              disabled={isEditing}
            >
              <span>✏️ Edit Profile</span>
              <span aria-hidden="true">›</span>
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={handleChangePassword}
            >
              <span>🔒 Change Password</span>
              <span aria-hidden="true">›</span>
            </button>

            <button
              type="button"
              disabled={loading}
              className="flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-left text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleDeleteAccount}
            >
              <span>🗑️ Delete Account</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <LogoutBtn className="rounded-lg bg-secondary px-8 py-3 font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent" />
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
