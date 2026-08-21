import {
  Sparkles,
  CalendarDays,
  BarChart3,
  FileText,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getContentAnalytics } from "../../services/contentService";
import useCurrentUser from "../../hooks/useCurrentUser";
import RecentContent from "../../components/dashboad/RecentContent";



const Dashboard = () => {
    const { user, loading } = useCurrentUser();

    const [analytics, setAnalytics] = useState({
      totalContent: 0,
      scheduledContent: 0,
      draftContent: 0,
      publishedContent: 0,
      thisMonth: 0,
      platformStats: [],
      contentTypeStats: [],
    });

    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    useEffect(() => {
      const loadAnalytics = async () => {
        try {
          const response = await getContentAnalytics();

          setAnalytics(response.data);
        } catch (error) {
          console.error("Failed to load analytics:", error);
        } finally {
          setAnalyticsLoading(false);
        }
      };

      loadAnalytics();
    }, []);
const stats = [
    {
      title: "Content Created",
      value: analytics?.totalContent ?? 0,
      description: "Total content generated",
      icon: FileText,
    },
    {
      title: "Scheduled Posts",
      value: analytics?.scheduledContent ?? 0,
      description: "Posts waiting to publish",
      icon: CalendarDays,
    },
    {
      title: "Published Posts",
      value: analytics?.publishedContent ?? 0,
      description: "Successfully published",
      icon: BarChart3,
    },
    {
      title: "Draft Content",
      value: analyticsLoading ? "..." : analytics.draftContent,
      description: "Content waiting to be finished",
      icon: FileText,
    }
  ];
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
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      {/* Platform Performance */}
      <section className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Platform Performance
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            See where you are creating the most content.
          </p>
        </div>

        {analytics.platformStats.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-sm text-gray-400">
            No platform data available yet.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.platformStats.map((item) => ({
                  platform: item._id,
                  content: item.count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />

                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />

                <Tooltip />

                <Bar dataKey="content" name="Content" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
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
        <div className="lg:col-span-2">
          <RecentContent />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
