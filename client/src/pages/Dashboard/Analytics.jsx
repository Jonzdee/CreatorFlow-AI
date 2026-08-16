import { useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  CalendarDays,
  PenLine,
  CheckCircle2,
} from "lucide-react";

import { getContentAnalytics } from "../../services/contentService";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await getContentAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <BarChart3 className="mx-auto text-gray-300" size={40} />
        <h2 className="mt-4 font-bold text-gray-900">
          Unable to load analytics
        </h2>
        <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Content",
      value: analytics.totalContent,
      description: "All content created",
      icon: FileText,
    },
    {
      title: "Scheduled",
      value: analytics.scheduledContent,
      description: "Upcoming posts",
      icon: CalendarDays,
    },
    {
      title: "Drafts",
      value: analytics.draftContent,
      description: "Content still in draft",
      icon: PenLine,
    },
    {
      title: "Published",
      value: analytics.publishedContent,
      description: "Published content",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
            <BarChart3 size={22} className="text-purple-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

            <p className="text-sm text-gray-500">
              Understand your content activity and performance.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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

                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </h2>
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

      {/* Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platforms */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-900">
            Content by Platform
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Where you're creating the most content.
          </p>

          <div className="space-y-4">
            {analytics.platformStats.length === 0 ? (
              <p className="text-sm text-gray-400">No platform data yet.</p>
            ) : (
              analytics.platformStats.map((item) => {
                const percentage =
                  analytics.totalContent > 0
                    ? Math.round((item.count / analytics.totalContent) * 100)
                    : 0;

                return (
                  <div key={item._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {item._id}
                      </span>

                      <span className="text-sm text-gray-500">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Content Types */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-lg font-bold text-gray-900">Content by Type</h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            The types of content you create most often.
          </p>

          <div className="space-y-4">
            {analytics.contentTypeStats.length === 0 ? (
              <p className="text-sm text-gray-400">No content type data yet.</p>
            ) : (
              analytics.contentTypeStats.map((item) => {
                const percentage =
                  analytics.totalContent > 0
                    ? Math.round((item.count / analytics.totalContent) * 100)
                    : 0;

                return (
                  <div key={item._id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        {item._id}
                      </span>

                      <span className="text-sm text-gray-500">
                        {item.count}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
