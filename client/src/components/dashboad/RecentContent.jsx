import { useEffect, useState } from "react";
import { FileText, Copy, Check, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { getUserContent } from "../../services/contentService";

const RecentContent = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-gray-900">Recent Content</h2>

        <div className="mt-6 animate-pulse space-y-4">
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Content</h2>

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

      {/* Empty */}
      {contents.length === 0 ? (
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
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contents.slice(0, 3).map((item) => (
            <div
              key={item._id}
              className="border border-gray-100 rounded-xl p-4 hover:border-purple-200 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">
                      {item.platform}
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {item.contentType}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.topic}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {item.content}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.content, item._id)}
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-purple-50 transition"
                  title="Copy content"
                >
                  {copiedId === item._id ? (
                    <Check size={17} className="text-green-600" />
                  ) : (
                    <Copy size={17} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom */}
      {contents.length > 0 && (
        <Link
          to="/dashboard/content"
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 hover:bg-purple-50 text-sm font-semibold text-gray-700 hover:text-purple-600 transition"
        >
          View all content
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default RecentContent;
