import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssistantResponse } from "../../services/assistantService";

const CreatorAssistant = ({ onClose }) => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your CreatorFlow AI assistant. I can help you plan content, understand your analytics, and come up with ideas.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // CLOSE ASSISTANT
  // ----------------------------------------

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // ----------------------------------------
  // SEND MESSAGE
  // ----------------------------------------

  const handleSend = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: trimmedMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await getAssistantResponse(trimmedMessage);

      const assistant = response?.data;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            assistant?.message || "I couldn't generate a response right now.",
          recommendation: assistant?.recommendation || null,
          actions: assistant?.actions || [],
        },
      ]);
    } catch (error) {
      console.error("Assistant error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error?.response?.data?.message ||
            "Sorry, I couldn't connect to CreatorFlow AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // CREATE CONTENT FROM RECOMMENDATION
  // ----------------------------------------

  const handleCreateContent = (recommendation) => {
    if (!recommendation) return;

    const params = new URLSearchParams();

    if (recommendation.topic) {
      params.set("topic", recommendation.topic);
    }

    if (recommendation.platform) {
      params.set("platform", recommendation.platform);
    }

    if (recommendation.contentType) {
      params.set("contentType", recommendation.contentType);
    }

    if (recommendation.writingStyle) {
      params.set("writingStyle", recommendation.writingStyle);
    }

    navigate(`/dashboard/create?${params.toString()}`);

    handleClose();
  };

  return (
    <div
      className="
        fixed
        bottom-5
        right-5
        z-[9999]
        w-[calc(100%-2rem)]
        sm:w-[420px]
        h-[620px]
        max-h-[calc(100vh-2rem)]
        bg-white
        rounded-2xl
        shadow-2xl
        border
        border-gray-200
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="bg-purple-600 text-white px-5 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Bot size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold truncate">CreatorFlow AI</h2>

            <p className="text-xs text-purple-100">Your content assistant</p>
          </div>
        </div>

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={handleClose}
          className="
            shrink-0
            w-10
            h-10
            rounded-lg
            flex
            items-center
            justify-center
            text-white
            hover:bg-white/20
            active:bg-white/30
            transition
            cursor-pointer
          "
          aria-label="Close CreatorFlow AI"
          title="Close"
        >
          <X size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={
              item.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                item.role === "user"
                  ? "max-w-[85%] bg-purple-600 text-white rounded-2xl rounded-br-md px-4 py-3 text-sm"
                  : "max-w-[90%] bg-white border border-gray-200 text-gray-700 rounded-2xl rounded-bl-md px-4 py-3 text-sm"
              }
            >
              <p className="whitespace-pre-wrap">{item.text}</p>

              {/* ========================================
                  RECOMMENDATION
              ======================================== */}

              {item.recommendation?.topic && (
                <div className="mt-4 border border-purple-100 rounded-xl p-3 bg-purple-50">
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                    <Sparkles size={15} />

                    <span>Recommendation</span>
                  </div>

                  {item.recommendation.title && (
                    <p className="font-semibold text-gray-900 mt-2">
                      {item.recommendation.title}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mt-1">
                    {item.recommendation.topic}
                  </p>

                  {item.recommendation.platform && (
                    <p className="text-xs text-gray-500 mt-2">
                      Platform:{" "}
                      <span className="font-medium">
                        {item.recommendation.platform}
                      </span>
                    </p>
                  )}

                  {item.recommendation.contentType && (
                    <p className="text-xs text-gray-500 mt-1">
                      Type:{" "}
                      <span className="font-medium">
                        {item.recommendation.contentType}
                      </span>
                    </p>
                  )}

                  {item.recommendation.reason && (
                    <p className="text-xs text-gray-500 mt-2">
                      {item.recommendation.reason}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCreateContent(item.recommendation)}
                    className="
                      w-full
                      mt-3
                      py-2
                      rounded-lg
                      bg-purple-600
                      text-white
                      text-sm
                      font-semibold
                      hover:bg-purple-700
                      transition
                    "
                  >
                    Create Content
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ========================================
            LOADING
        ======================================== */}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-500">
              CreatorFlow AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* ========================================
          INPUT
      ======================================== */}

      <form
        onSubmit={handleSend}
        className="p-3 border-t border-gray-200 bg-white shrink-0"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask CreatorFlow AI..."
            disabled={loading}
            className="
              flex-1
              min-w-0
              px-4
              py-3
              rounded-xl
              border
              border-gray-200
              outline-none
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-100
              text-sm
              disabled:bg-gray-100
            "
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="
              shrink-0
              w-11
              h-11
              rounded-xl
              bg-purple-600
              text-white
              flex
              items-center
              justify-center
              hover:bg-purple-700
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
            "
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatorAssistant;
