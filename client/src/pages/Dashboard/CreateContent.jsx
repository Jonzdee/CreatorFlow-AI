import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  generateContent,
  updateUserContent,
  scheduleUserContent,
  attachMediaToContent,
  getUploadSignature,
  uploadFileToCloudinary,
  getLatestDraftContent,
  removeMediaFromContent,
} from "../../services/contentService";

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
  Upload,
  X,
  Loader2,
} from "lucide-react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { CONTENT_TYPE_OPTIONS } from "@shared/contentTypes";
import { PLATFORM_OPTIONS } from "@shared/platforms";
import { WRITING_STYLE_OPTIONS } from "@shared/writingStyles";

import ScheduleModal from "../../components/content/ScheduleModal";

const CONTENT_ICONS = {
  Video,
  Carousel: Images,
  Image,
  Story: BookOpen,
  Thread: MessageSquare,
  Article: FileText,
  Short: Smartphone,
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_MEDIA_FILES = 10;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

const validateMediaFiles = (files) => {
  if (files.length > MAX_MEDIA_FILES) {
    return `You can upload a maximum of ${MAX_MEDIA_FILES} files at once.`;
  }

  for (const file of files) {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
      if (file.size > MAX_IMAGE_SIZE) {
        return `${file.name} is larger than the 10 MB image limit.`;
      }

      continue;
    }

    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      if (file.size > MAX_VIDEO_SIZE) {
        return `${file.name} is larger than the 100 MB video limit.`;
      }

      continue;
    }

    return `${file.name} is not a supported media format.`;
  }

  return null;
};
const CreateContent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ideaFromUrl = searchParams.get("idea");

  // --------------------------------
  // Content state
  // --------------------------------

  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  // --------------------------------
  // Editing state
  // --------------------------------

  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // --------------------------------
  // Error state
  // --------------------------------

  const [error, setError] = useState("");

  // --------------------------------
  // Scheduling state
  // --------------------------------

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  // --------------------------------
  // Media state
  // --------------------------------

  const [media, setMedia] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");


  const [restoringDraft, setRestoringDraft] = useState(true);
  const [draftRestored, setDraftRestored] = useState(false);
  // --------------------------------
  // Form state
  // --------------------------------

  const [formData, setFormData] = useState({
    contentType: "",
    platform: "",
    topic: ideaFromUrl || "",
    writingStyle: "",
  });


  useEffect(() => {
    const restoreDraft = async () => {
      if (ideaFromUrl) {
        setRestoringDraft(false);
        return;
      }

      try {
        const response = await getLatestDraftContent();

        if (response?.data) {
          const draft = response.data;

          setGeneratedContent(draft);
          setMedia(Array.isArray(draft.media) ? draft.media : []);

          setFormData({
            contentType: draft.contentType || "",
            platform: draft.platform || "",
            topic: draft.topic || "",
            writingStyle: draft.writingStyle || "",
          });

          setDraftRestored(true);
        }
      } catch (error) {
        console.error("Failed to restore draft:", error);
      } finally {
        setRestoringDraft(false);
      }
    };

    restoreDraft();
  }, [ideaFromUrl]);
  // --------------------------------
  // Form update
  // --------------------------------

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //-----------------------
  // validate before update
  //--------------

  // --------------------------------
  // Media upload
  // --------------------------------

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    // Always reset the input so the same file can be selected again
    e.target.value = "";

    if (!files.length) return;

    if (!generatedContent?._id) {
      setMediaError("Please generate your content before adding media.");
      return;
    }

    // Validate selected files
    const validationError = validateMediaFiles(files);

    if (validationError) {
      setMediaError(validationError);
      return;
    }

    try {
      setUploadingMedia(true);
      setMediaError("");
      setError("");

      /*
    |--------------------------------------------------------------------------
    | Get signed Cloudinary upload data
    |--------------------------------------------------------------------------
    */

      const signatureResponse = await getUploadSignature();

      const signatureData = signatureResponse.data;

      if (!signatureData) {
        throw new Error("Unable to prepare media upload. Please try again.");
      }

      /*
    |--------------------------------------------------------------------------
    | Upload files to Cloudinary
    |--------------------------------------------------------------------------
    */

      const uploadedMedia = [];

      for (const file of files) {
        const cloudinaryResponse = await uploadFileToCloudinary(
          file,
          signatureData,
        );

        if (!cloudinaryResponse?.secure_url) {
          throw new Error(`Failed to upload ${file.name}.`);
        }

        uploadedMedia.push({
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          resourceType: cloudinaryResponse.resource_type,
          originalName: file.name,
          format: cloudinaryResponse.format || "",
          width: cloudinaryResponse.width || null,
          height: cloudinaryResponse.height || null,
          bytes: cloudinaryResponse.bytes || null,
        });
      }

      /*
    |--------------------------------------------------------------------------
    | Combine existing media with newly uploaded media
    |--------------------------------------------------------------------------
    */

      const existingMedia = generatedContent.media || [];

      const updatedMedia = [...existingMedia, ...uploadedMedia];

      /*
    |--------------------------------------------------------------------------
    | Save media references to MongoDB
    |--------------------------------------------------------------------------
    */

      const response = await attachMediaToContent(
        generatedContent._id,
        updatedMedia,
      );

      if (!response?.data) {
        throw new Error(
          "Media uploaded but could not be attached to the content.",
        );
      }

      /*
    |--------------------------------------------------------------------------
    | Update UI
    |--------------------------------------------------------------------------
    */

      setGeneratedContent(response.data);

      setMedia(response.data.media || []);

      setMediaError("");

      setActionMessage(
        `${uploadedMedia.length} ${
          uploadedMedia.length === 1 ? "media file" : "media files"
        } added successfully.`,
      );
    } catch (error) {
      console.error("Media upload error:", error);

      setMediaError(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload media. Please try again.",
      );
    } finally {
      setUploadingMedia(false);
    }
  };
  // --------------------------------
  // Remove media from local preview
  // --------------------------------

  const handleRemoveMedia = async (publicId) => {
    if (!generatedContent?._id || !publicId) {
      return;
    }

    try {
      setActionLoading(true);
      setMediaError("");
      setActionMessage("");

      const response = await removeMediaFromContent(
        generatedContent._id,
        publicId,
      );

      setGeneratedContent(response.data);
      setMedia(response.data.media || []);

      setActionMessage("Media removed successfully.");
    } catch (error) {
      console.error("Remove media error:", error);

      setMediaError(error.response?.data?.message || "Failed to remove media.");
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------
  // Generate Content
  // --------------------------------

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!canGenerate) return;

    try {
      setGenerating(true);
      setError("");
      setGeneratedContent(null);
      setActionMessage("");
      setEditing(false);

      setMedia([]);
      setMediaError("");

      const response = await generateContent(formData);

      setGeneratedContent(response.data);

      // In case backend already returns media.
      if (Array.isArray(response.data?.media)) {
        setMedia(response.data.media);
      }
    } catch (error) {
      console.error("Generation error:", error);

      setError(error.response?.data?.message || "Failed to generate content.");
    } finally {
      setGenerating(false);
    }
  };

  // --------------------------------
  // Edit Content
  // --------------------------------

  const handleEdit = () => {
    setEditing(true);
    setActionMessage("");
  };

  // --------------------------------
  // Content Change
  // --------------------------------

  const handleContentChange = (value) => {
    setGeneratedContent((prev) => ({
      ...prev,
      content: value,
    }));
  };

  // --------------------------------
  // Save Edited Content
  // --------------------------------

  const handleSaveEdit = async () => {
    if (!generatedContent?._id) return;

    try {
      setActionLoading(true);
      setActionMessage("");
      setError("");

      const response = await updateUserContent(generatedContent._id, {
        content: generatedContent.content,
      });

      setGeneratedContent(response.data);

      if (Array.isArray(response.data?.media)) {
        setMedia(response.data.media);
      }

      setEditing(false);

      setActionMessage("Content updated successfully.");
    } catch (error) {
      console.error("Update content error:", error);

      setActionMessage(
        error.response?.data?.message || "Failed to update content.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // --------------------------------
  // Schedule Content
  // --------------------------------

  const handleSchedule = async (scheduledAt) => {
    if (!generatedContent?._id) {
      setError("Content ID is missing. Please generate the content again.");
      return;
    }

    try {
      setScheduling(true);
      setError("");

      const response = await scheduleUserContent(
        generatedContent._id,
        scheduledAt,
      );

      setGeneratedContent(response.data);

      setScheduleModalOpen(false);

      setActionMessage("Content scheduled successfully.");

      navigate("/dashboard/calendar");
    } catch (error) {
      console.error("Schedule error:", error);

      setError(error.response?.data?.message || "Failed to schedule content.");
    } finally {
      setScheduling(false);
    }
  };

  // --------------------------------
  // Validation
  // --------------------------------

  const canGenerate =
    formData.contentType &&
    formData.platform &&
    formData.topic.trim() &&
    formData.writingStyle;


  // --------------------------------
  // Render
  // --------------------------------

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
          className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition"
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
        {draftRestored && (
          <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
            Your latest draft has been restored.
          </div>
        )}
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

        {/* Error */}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Generated Content */}

        {generatedContent && (
          <section className="bg-white border border-gray-200 rounded-2xl p-5">
            {/* Generated Content Header */}

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-purple-600" />

                <h2 className="font-bold text-gray-900">Generated Content</h2>
              </div>

              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                {generatedContent.platform}
              </span>
            </div>

            {/* Content */}

            {editing ? (
              <textarea
                value={generatedContent.content}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={12}
                className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-y"
              />
            ) : (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {generatedContent.content}
                </p>
              </div>
            )}

            {/* Action message */}

            {actionMessage && (
              <div className="mt-4 rounded-xl bg-purple-50 border border-purple-100 p-3 text-sm text-purple-700">
                {actionMessage}
              </div>
            )}

            {/* Media */}

            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">Media</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add images or videos to your content.
                  </p>
                </div>

                <label
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold cursor-pointer hover:bg-purple-700 transition ${
                    uploadingMedia ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {uploadingMedia ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Add Media
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                    multiple
                    hidden
                    onChange={handleMediaUpload}
                    disabled={uploadingMedia}
                  />
                </label>
              </div>

              {/* Media error */}

              {mediaError && (
                <div className="mb-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {mediaError}
                </div>
              )}

              {/* Media preview */}

              {media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <div
                      key={`${item.publicId || item.url}-${index}`}
                      className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                    >
                      {item.resourceType === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.originalName || "Content media"}
                          className="w-full h-40 object-cover"
                        />
                      )}

                      {/* Remove preview */}

                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(item.publicId)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                        aria-label="Remove media preview"
                      >
                        <X size={14} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                        <p className="text-xs text-white truncate">
                          {item.originalName || item.publicId || "Media"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <Upload size={28} className="mx-auto text-gray-400" />

                  <p className="mt-2 text-sm font-medium text-gray-600">
                    No media added yet
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Upload images or videos for this content.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}

            <div className="flex flex-wrap gap-3 mt-5">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={actionLoading}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    disabled={actionLoading}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Edit Content
                  </button>

                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(true)}
                    disabled={actionLoading || uploadingMedia}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
                  >
                    Schedule
                  </button>
                </>
              )}
            </div>
          </section>
        )}
      </form>

      {/* Schedule Modal */}

      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={handleSchedule}
        loading={scheduling}
      />
    </motion.div>
  );
};

export default CreateContent;
