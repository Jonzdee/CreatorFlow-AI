import { useState } from "react";
import { motion } from "framer-motion";
import { generateContent } from "../../services/contentService";
import {
  Video,
  Images,
  Image,
  BookOpen,
  MessageSquare,
  FileText,
  Smartphone,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CONTENT_TYPE_OPTIONS } from "@shared/contentTypes";
import { PLATFORM_OPTIONS } from "@shared/platforms";
import { WRITING_STYLE_OPTIONS } from "@shared/writingStyles";

const CONTENT_ICONS = {
  Video,
  Carousel: Images,
  Image,
  Story: BookOpen,
  Thread: MessageSquare,
  Article: FileText,
  Short: Smartphone,
};

const CreateContent = () => {
  const navigate = useNavigate();
const [generating, setGenerating] = useState(false);
const [generatedContent, setGeneratedContent] = useState("");
const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    contentType: "",
    platform: "",
    topic: "",
    writingStyle: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!canGenerate) return;

    try {
      setGenerating(true);
      setError("");
      setGeneratedContent("");

      const response = await generateContent(formData);

      setGeneratedContent(response.data.content);
    } catch (error) {
      console.error("Generation error:", error);

      setError(error.response?.data?.message || "Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  };

  const canGenerate =
    formData.contentType &&
    formData.platform &&
    formData.topic.trim() &&
    formData.writingStyle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft size={19} />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Create Content
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Turn your idea into engaging content with AI.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Content Type */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900">
            What do you want to create?
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Choose the type of content you want AI to generate.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CONTENT_TYPE_OPTIONS.map((item) => {
              const Icon = CONTENT_ICONS[item.id];
              const selected = formData.contentType === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateFormData("contentType", item.id)}
                  className={`text-left rounded-xl border-2 p-4 transition ${
                    selected
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selected
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                  </div>

                  <h3 className="font-semibold text-gray-900 mt-3">
                    {item.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Platform */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900">Where will you publish?</h2>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Select the platform this content is for.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLATFORM_OPTIONS.map((platform) => {
              const selected = formData.platform === platform.id;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => updateFormData("platform", platform.id)}
                  className={`rounded-xl border-2 p-4 font-semibold text-sm transition ${
                    selected
                      ? "border-purple-600 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-700 hover:border-purple-300"
                  }`}
                >
                  {platform.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Topic */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <label htmlFor="topic" className="font-bold text-gray-900 block">
            What's your idea?
          </label>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            Tell CreatorFlow AI what you want to talk about.
          </p>

          <textarea
            id="topic"
            value={formData.topic}
            onChange={(e) => updateFormData("topic", e.target.value)}
            placeholder="Example: 5 ways small businesses can use AI to save time..."
            rows={5}
            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
          />
        </section>

        {/* Writing Style */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-bold text-gray-900">Choose your writing style</h2>

          <p className="text-sm text-gray-500 mt-1 mb-4">
            How should the content sound?
          </p>

          <div className="flex flex-wrap gap-2">
            {WRITING_STYLE_OPTIONS.map((style) => {
              const selected = formData.writingStyle === style.id;

              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => updateFormData("writingStyle", style.id)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                    selected
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "border-gray-200 text-gray-700 hover:border-purple-300"
                  }`}
                >
                  {style.title}
                </button>
              );
            })}
          </div>
        </section>

        {/* Generate */}
        <button
          type="submit"
          disabled={!canGenerate || generating}
          className="w-full sm:w-auto sm:min-w-55 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-white font-semibold transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles size={19} />

          {generating ? "Generating..." : "Generate Content"}
        </button>
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {generatedContent && (
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-purple-600" />

              <h2 className="font-bold text-gray-900">Generated Content</h2>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {generatedContent}
              </p>
            </div>
          </section>
        )}
      </form>
    </motion.div>
  );
};

export default CreateContent;
