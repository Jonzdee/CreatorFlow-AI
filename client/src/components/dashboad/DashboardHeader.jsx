import { Menu, Bell, ChevronDown, UserCircle } from "lucide-react";

import useCurrentUser from "../../hooks/useCurrentUser";

const DashboardHeader = ({ onMenuClick }) => {
  const { user, loading } = useCurrentUser();

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
          <button
            className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />

            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-white" />
          </button>

          <div className="hidden sm:block h-8 w-px bg-gray-200" />

          {/* User */}
          <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
              <UserCircle size={21} className="text-purple-600" />
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900">
                {loading ? "Loading..." : user?.name || "Creator"}
              </p>

              <p className="text-xs text-gray-500">Creator</p>
            </div>

            <ChevronDown size={16} className="hidden sm:block text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
