import React, { useRef, useState } from "react";
import "./UserProfilePage.css";
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
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
    }
  }

  const handleLogout = () => {
    setMessage("Logout will be connected to authentication later.");
  };

  return (
    <main className="profile-page">
      <section className="profile-container">
        <h1>User Profile</h1>

        <div className="profile-photo-section">
          <div className="profile-avatar">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={`${user.fullName}'s profile`}
                className="profile-image"
              />
            ) : (
              <span aria-hidden="true">👤</span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden-file-input"
            onChange={handlePhotoChange}
          />

          <button
            type="button"
            className="upload-button"
            onClick={handleUploadButtonClick}
          >
            Upload Photo
          </button>

          <small>JPG, PNG or WEBP. Maximum 2 MB.</small>
        </div>

        {message && (
          <p className="profile-message" role="status">
            {message}
          </p>
        )}

        <form onSubmit={handleSaveProfile}>
          <section className="profile-information">
            <div className="profile-field">
              <label htmlFor="fullName" className="field-label">
                Full Name
              </label>

              {isEditing ? (
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                />
              ) : (
                <span className="field-value">{user.fullName}</span>
              )}
            </div>

            <div className="profile-field">
              <label htmlFor="email" className="field-label">
                Email
              </label>

              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                />
              ) : (
                <span className="field-value">{user.email}</span>
              )}
            </div>

            <div className="profile-field">
              <span className="field-label">Member Since</span>
              <span className="field-value">{user.memberSince}</span>
            </div>
          </section>

          {isEditing && (
            <div className="edit-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <section className="account-settings">
          <h2>Account Settings</h2>

          <button
            type="button"
            className="settings-button"
            onClick={handleEditProfile}
            disabled={isEditing}
          >
            <span>✏️ Edit Profile</span>
            <span aria-hidden="true">›</span>
          </button>

          <button
            type="button"
            className="settings-button"
            onClick={handleChangePassword}
          >
            <span>🔒 Change Password</span>
            <span aria-hidden="true">›</span>
          </button>

          <button
            type="button"
            disabled={loading}
            className="settings-button delete-button"
            onClick={handleDeleteAccount}
          >
            <span>🗑️ Delete Account</span>
            <span aria-hidden="true">›</span>
          </button>
        </section>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </section>
    </main>
  );
}

export default UserProfilePage;
