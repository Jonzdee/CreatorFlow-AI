import { useEffect, useState } from "react";

import useCurrentUser from "../../hooks/useCurrentUser";
import { updateProfile, changePassword  } from "../../services/userService";
import {
  getUploadSignature,
  uploadFileToCloudinary,
} from "../../services/contentService";
import { UserCircle, Save, Camera, Loader2 } from "lucide-react";


const Profile = () => {
const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");

  const { user, loading, refreshUser } = useCurrentUser();
const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordLoading, setPasswordLoading] = useState(false);
const [passwordMessage, setPasswordMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    niche: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

 useEffect(() => {
   if (user) {
     setFormData({
       name: user.name || "",
       niche: user.niche || "",
     });

     setAvatar(user.avatar || "");
   }
 }, [user]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarMessage("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMessage("Profile picture must be less than 5 MB.");
      return;
    }

    try {
      setUploadingAvatar(true);
      setAvatarMessage("");

      // Get Cloudinary signature
      const signatureResponse = await getUploadSignature();

      const signatureData = signatureResponse.data;

      if (!signatureData) {
        throw new Error("Unable to prepare image upload.");
      }

      // Upload image
      const uploadResponse = await uploadFileToCloudinary(file, signatureData);

      if (!uploadResponse?.secure_url) {
        throw new Error("Image upload failed.");
      }

      // Save avatar URL to your backend
     const response = await updateProfile({
       avatar: uploadResponse.secure_url,
     });

     await refreshUser();

     window.dispatchEvent(new Event("userUpdated"));

     setAvatarMessage(
       response.message || "Profile picture updated successfully.",
     );
      // IMPORTANT:
      // Your useCurrentUser hook should refresh the user
      // or your AuthContext should update the user.
    } catch (error) {
      console.error("Avatar upload error:", error);

      setAvatarMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload profile picture.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await updateProfile(formData);

      setMessage(response.message || "Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      setMessage(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };
const handlePasswordChange = async (e) => {
  e.preventDefault();

  setPasswordMessage("");

  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    setPasswordMessage("Please fill in all password fields.");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordMessage("New passwords do not match.");
    return;
  }

  try {
    setPasswordLoading(true);

    const response = await changePassword(passwordForm);

    setPasswordMessage(response.message || "Password changed successfully.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    setPasswordMessage(
      error.response?.data?.message || "Failed to change password.",
    );
  } finally {
    setPasswordLoading(false);
  }

  const response = await updateProfile(formData);

  await refreshUser();

  window.dispatchEvent(new Event("userUpdated"));

  setMessage(response.message || "Profile updated successfully.");
};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and CreatorFlow profile.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center border-2 border-purple-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle size={42} className="text-purple-600" />
              )}
            </div>

            <label
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-white cursor-pointer hover:bg-purple-700 transition ${
                uploadingAvatar ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {uploadingAvatar ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Camera size={15} />
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
              />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {user?.name || "Creator"}
            </h2>

            <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
            />

            <p className="text-xs text-gray-400 mt-1.5">
              Email address cannot be changed here.
            </p>
          </div>

          {/* Niche */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Niche
            </label>

            <input
              type="text"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g. Technology, Fashion, Fitness"
            />
          </div>

          {/* Message */}
          {message && (
            <div className="px-4 py-3 rounded-xl bg-purple-50 text-purple-700 text-sm font-medium">
              {message}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your password to keep your account secure.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>

            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>

            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
            />
          </div>

          {passwordMessage && (
            <div className="p-3 rounded-xl bg-purple-50 text-sm text-purple-700">
              {passwordMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {passwordLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
