import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  X,
} from "lucide-react";

import {
  getScheduledContent,
  updateSchedule,
  cancelSchedule,
} from "../../services/contentService";

const Calendar = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState("");

  // ==============================
  // LOAD SCHEDULED CONTENT
  // ==============================

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getScheduledContent();

      console.log("Scheduled content:", response.data);

      setPosts(response.data || []);
    } catch (error) {
      console.error("Failed to load scheduled posts:", error);

      setError(
        error.response?.data?.message || "Failed to load scheduled content.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  // ==============================
  // DATE INFORMATION
  // ==============================

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  // ==============================
  // FORMAT NIGERIAN DATE
  // ==============================

  const formatNigeriaDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatNigeriaTime = (date) => {
    return new Date(date).toLocaleTimeString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==============================
  // GET POSTS FOR DAY
  // ==============================

  const getPostsForDay = (day) => {
    if (!day) return [];

    return posts.filter((post) => {
      if (!post.scheduledAt) return false;

      const date = new Date(post.scheduledAt);

      const nigeriaDate = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }).formatToParts(date);

      const dateParts = {};

      nigeriaDate.forEach((part) => {
        if (part.type !== "literal") {
          dateParts[part.type] = Number(part.value);
        }
      });

      return (
        dateParts.year === year &&
        dateParts.month === month + 1 &&
        dateParts.day === day
      );
    });
  };

  // ==============================
  // NAVIGATION
  // ==============================

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  // ==============================
  // TODAY
  // ==============================

  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();

    const todayParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Lagos",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(today);

    const todayDate = {};

    todayParts.forEach((part) => {
      if (part.type !== "literal") {
        todayDate[part.type] = Number(part.value);
      }
    });

    return (
      todayDate.year === year &&
      todayDate.month === month + 1 &&
      todayDate.day === day
    );
  };

  // ==============================
  // CANCEL SCHEDULE
  // ==============================

  const handleCancelSchedule = async () => {
    if (!selectedPost) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this scheduled post?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await cancelSchedule(selectedPost._id);

      setPosts((prev) => prev.filter((post) => post._id !== selectedPost._id));

      setSelectedPost(null);
    } catch (error) {
      console.error("Failed to cancel schedule:", error);

      alert(
        error.response?.data?.message || "Failed to cancel scheduled post.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==============================
  // RESCHEDULE
  // ==============================

  const handleReschedule = async () => {
    if (!selectedPost) return;

    const newDate = window.prompt(
      "Enter the new date and time.\n\nExample: 25/08/2026 10:00 AM",
    );

    if (!newDate) return;

    /*
      For now we still send the value to your backend.
      Later we can replace this prompt with the same
      ScheduleModal used in CreateContent.
    */

    try {
      setActionLoading(true);

      const response = await updateSchedule(selectedPost._id, newDate);

      const updatedPost = response.data;

      setPosts((prev) =>
        prev.map((post) =>
          post._id === selectedPost._id ? updatedPost : post,
        ),
      );

      setSelectedPost(updatedPost);

      // Move calendar to the new scheduled month
      if (updatedPost?.scheduledAt) {
        const newScheduledDate = new Date(updatedPost.scheduledAt);

        setCurrentDate(
          new Date(
            newScheduledDate.getFullYear(),
            newScheduledDate.getMonth(),
            1,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to reschedule:", error);

      alert(error.response?.data?.message || "Failed to reschedule post.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <CalendarDays size={22} className="text-purple-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Content Calendar
              </h1>

              <p className="text-sm text-gray-500">
                Plan and manage your upcoming content.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={goToday}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Today
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CALENDAR */}

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* CALENDAR HEADER */}

        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {monthName}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Previous month"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Next month"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {/* WEEKDAYS */}

        <div className="grid grid-cols-7 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 sm:p-3 text-center text-xs font-semibold text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* DAYS */}

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Loading calendar...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays size={40} className="mx-auto text-gray-300" />

            <h3 className="mt-4 font-semibold text-gray-700">
              No scheduled content yet
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Schedule a post from Create Content and it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayPosts = getPostsForDay(day);

              return (
                <div
                  key={`${day}-${index}`}
                  className={`min-h-24 sm:min-h-32 border-r border-b border-gray-200 p-1.5 sm:p-2 ${
                    day ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {day && (
                    <>
                      {/* DATE */}

                      <div className="flex justify-end">
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
                            isToday(day)
                              ? "bg-purple-600 text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {day}
                        </span>
                      </div>

                      {/* POSTS */}

                      <div className="mt-1 space-y-1">
                        {dayPosts.map((post) => {
                          const time = formatNigeriaTime(post.scheduledAt);

                          return (
                            <button
                              key={post._id}
                              type="button"
                              onClick={() => setSelectedPost(post)}
                              className="w-full text-left rounded-lg bg-purple-50 border border-purple-100 p-1.5 cursor-pointer hover:bg-purple-100 transition"
                              title="View scheduled post"
                            >
                              <p className="text-[10px] sm:text-xs font-semibold text-purple-700 truncate">
                                {post.topic}
                              </p>

                              <div className="hidden sm:flex items-center gap-1 mt-1 text-[10px] text-purple-500">
                                <Clock size={10} />
                                {time}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUMMARY */}

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <FileText size={19} className="text-purple-600" />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">Scheduled Content</h3>

            <p className="text-sm text-gray-500">
              {posts.length} scheduled {posts.length === 1 ? "post" : "posts"}.
            </p>
          </div>
        </div>
      </div>

      {/* POST DETAILS MODAL */}

      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* HEADER */}

            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Scheduled Post
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedPost.platform} • {selectedPost.contentType}
                </p>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Topic
                </p>

                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  {selectedPost.topic}
                </h3>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Content
                </p>

                <div className="mt-2 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
              </div>

              {selectedPost.scheduledAt && (
                <div className="flex flex-wrap gap-3">
                  <div className="px-3 py-2 rounded-lg bg-purple-50 text-purple-700 text-sm">
                    📱 {selectedPost.platform}
                  </div>

                  <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm">
                    📅 {formatNigeriaDate(selectedPost.scheduledAt)}
                  </div>

                  <div className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm">
                    🕐 {formatNigeriaTime(selectedPost.scheduledAt)}
                  </div>
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="p-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReschedule}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
              >
                {actionLoading ? "Processing..." : "Reschedule"}
              </button>

              <button
                onClick={handleCancelSchedule}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50 transition"
              >
                Cancel Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
