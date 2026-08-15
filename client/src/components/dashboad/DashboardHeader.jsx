import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useCurrentUser from "../../hooks/useCurrentUser";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = ({ onMenuClick }) => {
  const { user, loading } = useCurrentUser();
  const { logout } = useAuth();

  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "Welcome to CreatorFlow AI",
      message: "Your creator workspace is ready.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Start creating content",
      message: "Generate your first AI-powered post.",
      time: "Today",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
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
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowUserMenu(false);
              }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />

              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full border-2 border-white" />
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-sm bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {unreadCount} unread
                    </p>
                  </div>

                  <Bell size={18} className="text-purple-600" />
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex gap-3 px-4 py-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-50 flex items-center justify-center">
                          <CheckCircle2 size={18} className="text-purple-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {notification.message}
                          </p>

                          <p className="text-[11px] text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <Bell size={24} className="mx-auto text-gray-300" />

                      <p className="text-sm text-gray-500 mt-2">
                        No notifications
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* User */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowNotifications(false);
              }}
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
                className="hidden sm:block text-gray-400"
              />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || "Creator"}
                  </p>

                  <p className="text-xs text-gray-500 truncate mt-1">
                    {user?.email || ""}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/dashboard/settings");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings size={18} />
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
