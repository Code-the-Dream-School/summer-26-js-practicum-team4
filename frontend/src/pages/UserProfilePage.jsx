import React, { useRef, useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../services/userService";
import PropTypes from "prop-types";
import LogoutBtn from "../components/features/auth/LogoutBtn";
import { useAuth } from "../state/auth/useAuth";
import { uploadPhoto, deletePhoto } from "../services/profileImageService";

function StitchAvatar() {
  const stitches = [
    [47, 52, "#10263f"],
    [60, 65, "#10263f"],
    [73, 78, "#10263f"],
    [86, 91, "#c86839"],
    [99, 78, "#c86839"],
    [112, 65, "#c86839"],
    [125, 52, "#c86839"],
    [60, 91, "#d0a57d"],
    [73, 104, "#d0a57d"],
    [86, 117, "#10263f"],
    [99, 104, "#10263f"],
    [112, 91, "#10263f"],
  ];

  return (
    <svg
      viewBox="0 0 180 180"
      className="h-full w-full"
      aria-label="Cross stitch avatar"
    >
      <circle
        cx="90"
        cy="90"
        r="84"
        fill="#fbf7f1"
        stroke="#c79c69"
        strokeWidth="5"
      />

      <rect x="72" y="2" width="36" height="8" rx="3" fill="#c79c69" />
      <rect x="84" y="0" width="12" height="12" rx="3" fill="#c79c69" />

      {stitches.map(([x, y, color], index) => (
        <g key={index} stroke={color} strokeWidth="4" strokeLinecap="round">
          <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
          <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} />
        </g>
      ))}
    </svg>
  );
}

function PatternGeneratedIcon() {
  const points = [
    [40, 28],
    [60, 28],
    [80, 28],
    [40, 48],
    [60, 48],
    [80, 48],
    [40, 68],
    [60, 68],
    [80, 68],
  ];

  return (
    <svg
      viewBox="0 0 120 120"
      className="h-24 w-24 md:h-28 md:w-28"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="54" fill="#f5ede3" />

      {points.map(([x, y], index) => (
        <rect
          key={index}
          x={x - 6}
          y={y - 6}
          width="12"
          height="12"
          rx="1"
          fill="none"
          stroke="#b54d26"
          strokeWidth="4"
        />
      ))}
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function PasswordField({
  id,
  name,
  placeholder,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-base text-[#7b7b7b]">
        🔒
      </span>

      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#dfcdbd] bg-[#fffdf9] px-14 py-4 pr-14 text-base text-[#1a1a1a] outline-none transition focus:border-[#b44d28] focus:ring-2 focus:ring-[#b44d28]/10"
        required
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7b7b7b] transition hover:text-[#10263f]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <EyeIcon />
      </button>
    </div>
  );
}

PasswordField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  autoComplete: PropTypes.string.isRequired,
};

function DecorativeStitches() {
  const colors = ["#10263f", "#b44d28", "#d8b994", "#b44d28", "#10263f"];

  return (
    <div className="pointer-events-none absolute right-0 top-0 hidden w-[420px] grid-cols-10 gap-x-3 gap-y-2 text-3xl lg:grid">
      {Array.from({ length: 40 }).map((_, index) => (
        <span
          key={index}
          className="leading-none"
          style={{ color: colors[index % colors.length] }}
        >
          ×
        </span>
      ))}
    </div>
  );
}

function UserProfilePage() {
  const { dispatch, state } = useAuth();

  const [user, setUser] = useState({});
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visiblePasswords, setVisiblePasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const fileInputRef = useRef(null);

  function setUserProfileData(data) {
    const { id, userName, email, userProfileImgUrl, createdAt, hasPassword } =
      data;

    const convertedDate = `${new Date(createdAt).toLocaleString("en-US", {
      month: "long",
    })} ${new Date(createdAt).getFullYear()}`;

    setUser({
      id,
      fullName: userName,
      email,
      memberSince: convertedDate,
      profilePhoto: userProfileImgUrl,
      patternsGenerated: data._count.patterns ? data._count.patterns : 0,
      hasPassword,
    });
  }

  useEffect(() => {
    async function getUserData() {
      setMessage({ text: "", error: false });
      try {
        const userData = await getUser();

        if (userData) {
          setUserProfileData(userData);
        }
      } catch {
        setMessage({ text: "Failed to fetch user data.", error: true });
      }
    }
    getUserData();
  }, []);

  async function updateUserData(userData) {
    setMessage({ text: "", error: false });
    try {
      const updatedData = await updateUser(userData);
      if (updatedData) {
        setUserProfileData(updatedData);
      }
      return true;
    } catch {
      setMessage({ text: "Failed to update user data.", error: true });
      return false;
    }
  }
  const handleEditProfile = () => {
    setFormData(user);
    setIsEditing(true);
    setMessage({ text: "", error: false });
  };

  const handleInputChange = (event) => {
    setMessage({ text: "", error: false });
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    setMessage({ text: "", error: false });
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setMessage({ text: "Full name is required.", error: true });
      return;
    } else if (formData.fullName.length < 3) {
      setMessage({
        text: "Full name must be at least 3 characters.",
        error: true,
      });
      return;
    }

    const updateSuccess = await updateUserData({ userName: formData.fullName });
    if (updateSuccess) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...state.user,
          userName: formData.fullName,
        },
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
    setMessage({ text: "", error: false });
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage({ text: "Please select an image file.", error: true });
      return;
    }

    const maximumFileSize = 2 * 1024 * 1024;

    if (selectedFile.size > maximumFileSize) {
      setMessage({
        text: "Profile photo must be smaller than 2 MB.",
        error: true,
      });
      return;
    }

    try {
      const uploadedImageUrl = await uploadPhoto(selectedFile, user.email);

      const updateSuccess = await updateUserData({
        userProfileImgUrl: uploadedImageUrl,
      });

      if (updateSuccess) {
        setMessage({
          text: "Profile photo updated successfully.",
          error: false,
        });
      }
    } catch {
      setMessage({ text: "Failed to update profile photo.", error: true });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoDelete = async () => {
    try {
      await deletePhoto(user.email);
      const updateSuccess = await updateUserData({
        userProfileImgUrl: null,
      });

      if (updateSuccess) {
        setMessage({
          text: "Profile photo deleted successfully.",
          error: false,
        });
      }
    } catch {
      setMessage({ text: "Failed to delete profile photo.", error: true });
    }
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswords((previous) => ({
      ...previous,
      [fieldName]: !previous[fieldName],
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (user.hasPassword && !currentPassword) {
      setMessage({ text: "Current password is required.", error: true });
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Please complete all password fields.", error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match.", error: true });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        text: "New password must be at least 8 characters.",
        error: true,
      });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setMessage({ text: "Password must include a number.", error: true });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage({
        text: "Password must include an uppercase letter.",
        error: true,
      });
      return;
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      setMessage({
        text: "Password must include a special character.",
        error: true,
      });
      return;
    }

    const isPasswordChanged = await updateUserData(
      user.hasPassword
        ? {
            oldPassword: currentPassword,
            newPassword: newPassword,
          }
        : {
            newPassword: newPassword,
          },
    );

    if (isPasswordChanged) {
      setMessage({ text: "Password updated successfully.", error: false });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?",
    );

    if (!confirmed) return;

    dispatch({ type: "SET_LOADING" });

    try {
      await deleteUser();
      await deletePhoto(user.email);
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message,
      });
      setMessage({ text: "Failed to delete account.", error: true });
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf7f1]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Page Heading */}
        <header className="relative mb-8 overflow-hidden pb-2">
          <DecorativeStitches />

          <h1 className="relative z-10 font-heading text-5xl font-bold text-[#10263f]">
            User Profile
          </h1>

          <div className="relative z-10 mt-4 flex items-center gap-3 text-[#b44d28]">
            <span className="h-px w-24 bg-[#b44d28]" />
            <span className="font-bold">×</span>
            <span className="h-px w-24 bg-[#b44d28]" />
          </div>

          <p className="relative z-10 mt-4 text-lg text-[#666]">
            Manage your account and update your profile.
          </p>
        </header>

        {/* Profile Card */}
        <section className="mb-7 rounded-[22px] border border-[#eadfd3] bg-white px-6 py-8 shadow-[0_8px_24px_rgba(54,38,25,0.08)] md:px-10">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr_270px] lg:items-center">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="h-44 w-44 overflow-hidden rounded-full">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={`${user.fullName}'s profile`}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <StitchAvatar />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={handlePhotoChange}
              />

              <button
                type="button"
                onClick={handlePhotoClick}
                className="mt-4  w-full rounded-lg bg-[#b44d28] px-7 py-3 text-lg font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                📷 Upload Photo
              </button>

              {user.profilePhoto && (
                <button
                  type="button"
                  onClick={handlePhotoDelete}
                  className="mt-2  w-full rounded-lg border border-[#b44d28] px-7 py-3 text-lg font-semibold text-[#b44d28] transition hover:bg-[#fbf7f1]"
                >
                  🗑 Delete Photo
                </button>
              )}

              <p className="mt-3 text-center text-sm leading-5 text-[#6d6d6d]">
                JPG,JPEG, PNG or WEBP.
                <br />
                Maximum 2 MB.
              </p>
            </div>

            {/* User Details */}
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-6">
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#676767]">
                    Full Name
                  </p>

                  <div className="flex items-center gap-4">
                    {isEditing ? (
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName ? formData.fullName : ""}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-[#decdbb] bg-[#fffdf9] px-4 py-3 text-lg outline-none focus:border-[#b44d28]"
                        required
                      />
                    ) : (
                      <p className="font-heading text-4xl font-semibold text-[#10263f]">
                        {user.fullName}
                      </p>
                    )}

                    {!isEditing && (
                      <button
                        type="button"
                        onClick={handleEditProfile}
                        aria-label="Edit name"
                        className="rounded-xl border border-[#b44d28] px-4 py-3 text-xl text-[#b44d28] transition hover:bg-[#fbf7f1]"
                      >
                        ✎
                      </button>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#676767]">
                    Email Address
                  </p>

                  <p className="text-lg text-[#1a1a1a]">{user.email}</p>

                  <p className="mt-2 text-sm text-[#777]">
                    🔒 Email cannot be changed
                  </p>
                </div>

                {/* Member Since */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#676767]">
                    Member Since
                  </p>

                  <p className="text-lg text-[#1a1a1a]">
                    📅 {user.memberSince}
                  </p>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#10263f] px-6 py-3 font-semibold text-white"
                    >
                      Save Name
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-lg border border-[#decdbb] px-6 py-3 font-semibold text-[#10263f]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Patterns Generated */}
            <div className="flex min-h-[245px] flex-col items-center justify-center border-t border-[#e7d9ca] pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
              <PatternGeneratedIcon />

              <p className="mt-1 font-heading text-7xl font-bold leading-none text-[#b44d28]">
                {user.patternsGenerated}
              </p>

              <p className="mt-2 text-center text-xl font-semibold text-[#10263f]">
                Patterns Generated
              </p>

              <div className="mt-4 flex items-center gap-3 text-[#b44d28]">
                <span className="h-px w-12 bg-[#b44d28]" />
                <span>×</span>
                <span className="h-px w-12 bg-[#b44d28]" />
              </div>
            </div>
          </div>
        </section>

        {/* Status Message */}
        {message.text && (
          <div
            role="status"
            className={`mb-5 rounded-xl border ${message.error ? "border-[#b44d28] text-red-700" : "border-[#decdbb] text-[#10263f]"} bg-white px-5 py-3 text-center font-medium shadow-sm`}
          >
            {message.text}
          </div>
        )}

        {/* Change Password Card */}
        <section className="mb-7 rounded-[22px] border border-[#eadfd3] bg-white px-6 py-8 shadow-[0_8px_24px_rgba(54,38,25,0.08)] md:px-9">
          <div className="mb-7">
            <h2 className="font-heading text-3xl font-bold text-[#10263f]">
              {user.hasPassword ? "Change Password" : "Set Password"}
            </h2>

            <div className="mt-3 flex items-center gap-3 text-[#b44d28]">
              <span className="h-px w-12 bg-[#b44d28]" />
              <span>×</span>
              <span className="h-px w-12 bg-[#b44d28]" />
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="grid gap-8 lg:grid-cols-[1fr_340px]"
          >
            {/* Password Fields */}
            <div className="space-y-4">
              {user.hasPassword && (
                <PasswordField
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  visible={visiblePasswords.currentPassword}
                  onToggle={() => togglePasswordVisibility("currentPassword")}
                  autoComplete="current-password"
                />
              )}

              <PasswordField
                id="newPassword"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                visible={visiblePasswords.newPassword}
                onToggle={() => togglePasswordVisibility("newPassword")}
                autoComplete="new-password"
              />

              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Enter New Password Again"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                visible={visiblePasswords.confirmPassword}
                onToggle={() => togglePasswordVisibility("confirmPassword")}
                autoComplete="new-password"
              />
            </div>

            {/* Password Requirements */}
            <aside className="self-start">
              <div className="rounded-2xl bg-[#f7f0e8] p-6">
                <h3 className="mb-5 font-heading text-xl font-bold text-[#b44d28]">
                  Password must:
                </h3>

                <div className="space-y-3 text-[#555]">
                  <p>
                    <span className="mr-3 text-[#b44d28]">◉</span>
                    Be at least 8 characters
                  </p>

                  <p>
                    <span className="mr-3 text-[#b44d28]">◉</span>
                    Include a number
                  </p>

                  <p>
                    <span className="mr-3 text-[#b44d28]">◉</span>
                    Include an uppercase letter
                  </p>

                  <p>
                    <span className="mr-3 text-[#b44d28]">◉</span>
                    Include a special character
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-[#b44d28] px-6 py-4 text-xl font-semibold text-white transition hover:opacity-90"
              >
                Update Password
              </button>
            </aside>
          </form>
        </section>

        {/* Bottom Actions */}
        <section className="rounded-[22px] border border-[#eadfd3] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(54,38,25,0.08)]">
          <div className="grid gap-5 md:grid-cols-[1fr_320px] md:items-stretch">
            {/* Delete Account */}
            <button
              type="button"
              disabled={state.loading}
              onClick={handleDeleteAccount}
              className="flex items-center justify-between px-5 py-4 text-left md:border-r md:border-[#eadfd3]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4eadc] text-2xl text-[#b44d28]">
                  🗑️
                </div>

                <div>
                  <p className="font-heading text-lg font-semibold text-[#10263f]">
                    Delete Account
                  </p>

                  <p className="mt-1 text-sm leading-5 text-[#666]">
                    Permanently delete your account and all your data.
                  </p>
                </div>
              </div>

              <span className="text-2xl text-[#10263f]">›</span>
            </button>

            {/* Logout */}
            <div className="flex items-center justify-center px-5 py-3">
              <LogoutBtn className="w-full rounded-xl bg-[#10263f] px-8 py-5 text-lg font-semibold text-white transition hover:opacity-90" />
            </div>
          </div>
        </section>

        {/* Tagline */}
        <div className="mt-9 flex items-center justify-center gap-4 pb-3 text-sm tracking-[0.3em] text-[#10263f]">
          <span className="hidden h-px w-40 bg-[#d6ad83] sm:block" />

          <span className="text-[#b44d28]">×</span>

          <span>
            STITCH. <span className="text-[#b44d28]">CREATE.</span> SHARE.
          </span>

          <span className="text-[#b44d28]">×</span>

          <span className="hidden h-px w-40 bg-[#d6ad83] sm:block" />
        </div>
      </div>
    </main>
  );
}

export default UserProfilePage;
