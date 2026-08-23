import { useEffect, useState } from "react";
import { Sparkles, ArrowUpRight, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { getAssistantResponse } from "../../services/assistantService";

const AIDashboardInsight = ({ analytics }) => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsight = async () => {
      try {
        setLoading(true);

        const message = `
Analyze my CreatorFlow dashboard and give me one useful,
specific recommendation for what I should do next.

My current analytics:
- Total content: ${analytics?.totalContent || 0}
- Draft content: ${analytics?.draftContent || 0}
- Scheduled content: ${analytics?.scheduledContent || 0}
- Published content: ${analytics?.publishedContent || 0}

Platform performance:
${JSON.stringify(analytics?.platformStats || [])}

Content type performance:
${JSON.stringify(analytics?.contentTypeStats || [])}

Give me a practical recommendation based only on this data.
Do not invent information.
`;

        const response = await getAssistantResponse(message);

        setInsight(response?.data || null);
      } catch (error) {
        console.error("Dashboard AI insight error:", error);
        setInsight(null);
      } finally {
        setLoading(false);
      }
    };

    if (!analytics) return;

    generateInsight();
  }, [analytics]);

  if (loading) {
    return (
      <section className="rounded-2xl bg-white border border-purple-100 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Sparkles size={20} className="text-purple-600 animate-pulse" />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              CreatorFlow AI is analyzing your dashboard...
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Looking for your next content opportunity.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!insight) {
    return null;
  }

  const recommendation = insight.recommendation;

  return (
    <section className="rounded-2xl bg-linear-to-br from-purple-50 via-white to-purple-50 border border-purple-100 p-5 sm:p-6">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
            <Bot size={21} className="text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />

              <span className="text-sm font-semibold text-purple-600">
                CreatorFlow AI
              </span>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mt-1">
              Your AI Insight
            </h2>
          </div>
        </div>
      </div>

      {/* AI MESSAGE */}

      {insight.message && (
        <div className="mt-5">
          <p className="text-sm sm:text-base text-gray-700 leading-6">
            {insight.message}
          </p>
        </div>
      )}

      {/* RECOMMENDATION */}

      {recommendation?.topic && (
        <div className="mt-5 bg-white border border-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-600" />

            <span className="text-sm font-semibold text-purple-700">
              Recommended next step
            </span>
          </div>

          {recommendation.title && (
            <h3 className="font-bold text-gray-900 mt-3">
              {recommendation.title}
            </h3>
          )}

          <p className="text-sm text-gray-600 mt-1">{recommendation.topic}</p>

          {recommendation.reason && (
            <p className="text-xs text-gray-500 mt-3">
              {recommendation.reason}
            </p>
          )}

          <Link
            to={`/dashboard/create?topic=${encodeURIComponent(
              recommendation.topic || "",
            )}&platform=${encodeURIComponent(
              recommendation.platform || "",
            )}&contentType=${encodeURIComponent(
              recommendation.contentType || "",
            )}&writingStyle=${encodeURIComponent(
              recommendation.writingStyle || "",
            )}`}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
          >
            <Sparkles size={16} />
            Create with AI
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </section>
  );
};

export default AIDashboardInsight;
