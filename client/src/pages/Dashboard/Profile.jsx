import { useEffect, useState } from "react";
import { UserCircle, Save } from "lucide-react";
import useCurrentUser from "../../hooks/useCurrentUser";
import { updateProfile, changePassword  } from "../../services/userService";

const Profile = () => {
  const { user, loading } = useCurrentUser();
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
    }
  }, [user]);

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
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <UserCircle size={38} className="text-purple-600" />
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
