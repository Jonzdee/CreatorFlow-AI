import {
  Sparkles,
  CalendarDays,
  BarChart3,
  FileText,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";



const stats = [
  {
    title: "Content Created",
    value: "0",
    description: "Total content generated",
    icon: FileText,
  },
  {
    title: "Scheduled Posts",
    value: "0",
    description: "Posts waiting to publish",
    icon: CalendarDays,
  },
  {
    title: "Engagement",
    value: "0%",
    description: "Average engagement",
    icon: BarChart3,
  },
];

const Dashboard = () => {
    const { user, loading } = useCurrentUser();

    if (loading) {
      return <div>Loading...</div>;
    }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <section className="rounded-2xl bg-linear-to-br from-purple-600 to-purple-700 p-6 sm:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} />
              <span className="text-sm font-medium text-purple-100">
                CreatorFlow AI
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {user?.name || "Creator"} 👋
            </h1>

            <p className="mt-2 text-purple-100 max-w-xl">
              Turn your ideas into engaging content and keep your social media
              presence consistent.
            </p>
          </div>

          <Link
            to="/dashboard/create"
            className="inline-flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold px-5 py-3 rounded-xl hover:bg-purple-50 transition"
          >
            <Plus size={19} />
            Create Content
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-200 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h3 className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Icon size={21} className="text-purple-600" />
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">{stat.description}</p>
            </div>
          );
        })}
      </section>

      {/* Quick Actions + Recent Content */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Start creating something today.
          </p>

          <div className="space-y-3">
            <Link
              to="/dashboard/create"
              className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Sparkles size={19} className="text-white" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Generate Content
                  </p>

                  <p className="text-xs text-gray-500">
                    Let AI create your post
                  </p>
                </div>
              </div>

              <ArrowUpRight size={18} className="text-purple-600" />
            </Link>

            <Link
              to="/dashboard/calendar"
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <CalendarDays size={19} className="text-purple-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">View Calendar</p>

                  <p className="text-xs text-gray-500">
                    Manage scheduled posts
                  </p>
                </div>
              </div>

              <ArrowUpRight size={18} className="text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Content */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Content
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest generated content.
              </p>
            </div>

            <Link
              to="/dashboard/content"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>

          {/* Empty state */}
          <div className="min-h-52 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
              <FileText size={25} className="text-purple-600" />
            </div>

            <h3 className="font-semibold text-gray-900 mt-4">No content yet</h3>

            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Your generated posts will appear here once you create your first
              piece of content.
            </p>

            <Link
              to="/dashboard/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
            >
              <Sparkles size={17} />
              Create your first post
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
