import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, Bell, ChevronDown, UserCircle, Check } from "lucide-react";

import useCurrentUser from "../../hooks/useCurrentUser";
import {
  getNotifications,
  markNotificationRead,
} from "../../services/notificationService";

const DashboardHeader = ({ onMenuClick }) => {
  const { user, loading } = useCurrentUser();
const navigate = useNavigate();
const { logout } = useAuth();
const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await getNotifications();

        setNotifications(response.notifications || []);
        setUnreadCount(response.unreadCount || 0);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.read) return;

    try {
      await markNotificationRead(notification._id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item,
        ),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition"
            aria-label="Open menu"
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          <div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900">
              Dashboard
            </h2>

            <p className="hidden sm:block text-sm text-gray-500">
              Manage your content and grow your audience.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-[320px] sm:w-[380px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {unreadCount} unread
                    </p>
                  </div>
                </div>

                {/* Notifications */}
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell size={28} className="mx-auto text-gray-300" />

                      <p className="mt-3 text-sm font-medium text-gray-600">
                        No notifications
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                          !notification.read ? "bg-purple-50/50" : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-100 flex items-center justify-center">
                            {notification.read ? (
                              <Check size={17} className="text-purple-600" />
                            ) : (
                              <Bell size={17} className="text-purple-600" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>

                            <p className="text-[10px] text-gray-400 mt-2">
                              {new Date(
                                notification.createdAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition"
            >
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                <UserCircle size={21} className="text-purple-600" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {loading ? "Loading..." : user?.name || "Creator"}
                </p>

                <p className="text-xs text-gray-500">Creator</p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden sm:block text-gray-400 transition ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/dashboard/profile");
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/dashboard/settings");
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                >
                  Settings
                </button>

                <div className="border-t border-gray-100" />

                <button
                  onClick={() => {
                    logout();
                    navigate("/login", { replace: true });
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
