import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  BarChart3,
  FileText,
  Lightbulb,
  Settings,
  UserCircle,
  Plus,
  X,
} from "lucide-react";

const mainLinks = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Content",
    path: "/dashboard/create",
    icon: Sparkles,
  },
  {
    name: "Content Calendar",
    path: "/dashboard/calendar",
    icon: CalendarDays,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const manageLinks = [
  {
    name: "My Content",
    path: "/dashboard/content",
    icon: FileText,
  },
  {
    name: "Saved Ideas",
    path: "/dashboard/ideas",
    icon: Lightbulb,
  },
];

const accountLinks = [
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

const DashboardSidebar = ({ isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
    fixed
    top-0
    left-0
    z-50
    h-screen
    w-72
    bg-white
    border-r
    border-gray-200
    flex
    flex-col
    transition-transform
    duration-300

    ${isOpen ? "translate-x-0" : "-translate-x-full"}

    lg:translate-x-0
  `}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
              <Sparkles className="text-white" size={21} />
            </div>

            <div>
              <h1 className="font-bold text-gray-900 leading-none">
                CreatorFlow
              </h1>

              <span className="text-xs text-purple-600 font-medium">AI</span>
            </div>
          </div>

          {/* Mobile close */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <NavSection title="Main" links={mainLinks} />

          <NavSection title="Manage" links={manageLinks} />

          <NavSection title="Account" links={accountLinks} />
        </nav>

        {/* Create Content */}
        <div className="p-4 border-t border-gray-100">
          <NavLink
            to="/dashboard/create"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
          >
            <Plus size={19} />
            Create Content
          </NavLink>
        </div>
      </aside>
    </>
  );
};

const NavSection = ({ title, links }) => {
  return (
    <div className="mb-7">
      <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </p>

      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-3 py-3
                rounded-xl
                text-sm font-medium
                transition-all
                ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    className={isActive ? "text-purple-600" : "text-gray-400"}
                  />

                  <span>{link.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
