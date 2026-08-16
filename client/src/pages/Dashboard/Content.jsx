import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Copy,
  Check,
  Trash2,
  FileText,
  Pencil,
  CalendarDays,
} from "lucide-react";

import {
  getUserContent,
  deleteUserContent,
  updateUserContent,
  scheduleUserContent,
} from "../../services/contentService";

const Content = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");
const [schedulingId, setSchedulingId] = useState(null);
const [scheduleDate, setScheduleDate] = useState("");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [contentType, setContentType] = useState("all");

  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await getUserContent();

        setContents(response.data || []);
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const platforms = useMemo(() => {
    return [...new Set(contents.map((item) => item.platform))];
  }, [contents]);

  const contentTypes = useMemo(() => {
    return [...new Set(contents.map((item) => item.contentType))];
  }, [contents]);

  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const matchesSearch =
        item.topic?.toLowerCase().includes(search.toLowerCase()) ||
        item.content?.toLowerCase().includes(search.toLowerCase());

      const matchesPlatform = platform === "all" || item.platform === platform;

      const matchesType =
        contentType === "all" || item.contentType === contentType;

      return matchesSearch && matchesPlatform && matchesType;
    });
  }, [contents, search, platform, contentType]);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditText(item.content);
  };

  const handleSaveEdit = async (item) => {
    try {
      const response = await updateUserContent(item._id, {
        content: editText,
      });

      setContents((prev) =>
        prev.map((content) =>
          content._id === item._id ? response.data : content,
        ),
      );

      setEditingId(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update content");
    }
  };

const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this content?",
  );

  if (!confirmed) return;

  try {
    await deleteUserContent(id);

    setContents((prev) => prev.filter((item) => item._id !== id));
  } catch (error) {
    console.error("Delete failed:", error);

    alert("Failed to delete content");
  }
};
  const handleCopy = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };
const handleSchedule = async (item) => {
  if (!scheduleDate) {
    alert("Please select a date and time.");
    return;
  }

  try {
    const response = await scheduleUserContent(item._id, scheduleDate);

    setContents((prev) =>
      prev.map((content) =>
        content._id === item._id ? response.data : content,
      ),
    );

    setSchedulingId(null);
    setScheduleDate("");
  } catch (error) {
    console.error("Schedule failed:", error);

    alert(error.response?.data?.message || "Failed to schedule content");
  }
};
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>

          <p className="text-gray-500 mt-1">
            Manage all your generated content.
          </p>
        </div>

        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Content Library
        </h1>

        <p className="text-gray-500 mt-1">Manage all your generated content.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your content..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="all">All Platforms</option>

          {platforms.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="all">All Content Types</option>

          {contentTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-500">
        {filteredContents.length}{" "}
        {filteredContents.length === 1 ? "piece" : "pieces"} of content
      </div>

      {/* Content */}
      {filteredContents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">
            <FileText size={25} className="text-purple-600" />
          </div>

          <h3 className="font-semibold text-gray-900 mt-4">No content found</h3>

          <p className="text-sm text-gray-500 mt-1">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredContents.map((item) => (
            <article
              key={item._id}
              className="bg-white border border-gray-200 rounded-2xl p-5"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                  {item.platform}
                </span>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {item.contentType}
                </span>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
                  {item.status}
                </span>
              </div>

              {/* Topic */}
              <h2 className="font-bold text-gray-900">{item.topic}</h2>

              {/* Content */}
              {editingId === item._id ? (
                <div className="mt-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-purple-200 p-4 text-sm outline-none focus:ring-2 focus:ring-purple-100"
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(item)}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold"
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">
                    {item.content}
                  </p>
                </div>
              )}
              {schedulingId === item._id && (
                <div className="mt-4 p-4 rounded-xl bg-purple-50">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Choose date and time
                  </label>

                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-purple-500"
                  />

                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => handleSchedule(item)}
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold"
                    >
                      Schedule Post
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSchedulingId(null);
                        setScheduleDate("");
                      }}
                      className="px-4 py-2 rounded-lg bg-white text-gray-700 text-sm font-semibold border border-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.content, item._id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-purple-50 transition"
                    title="Copy"
                  >
                    {copiedId === item._id ? (
                      <Check size={17} className="text-green-600" />
                    ) : (
                      <Copy size={17} className="text-gray-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchedulingId(item._id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-purple-50 transition"
                    title="Schedule"
                  >
                    <CalendarDays size={17} className="text-purple-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-purple-50 transition"
                    title="Edit"
                  >
                    <Pencil size={17} className="text-purple-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 size={17} className="text-red-500" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;
