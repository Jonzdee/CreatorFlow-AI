import {
  Lightbulb,
  Plus,
  Search,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
} from "../../services/ideaService";

const EMPTY_FORM = {
  title: "",
  description: "",
  platform: "",
  contentType: "",
};

const Ideas = () => {
  // ----------------------------------------
  // STATE
  // ----------------------------------------

  const [ideas, setIdeas] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingIdea, setEditingIdea] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ----------------------------------------
  // LOAD IDEAS
  // ----------------------------------------

  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getIdeas();

      setIdeas(response.data || []);
    } catch (error) {
      console.error("Failed to load ideas:", error);

      setError(
        error.response?.data?.message || "Failed to load your saved ideas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  // ----------------------------------------
  // FORM CHANGE
  // ----------------------------------------

  const handleFormChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ----------------------------------------
  // OPEN CREATE FORM
  // ----------------------------------------

  const handleAddIdea = () => {
    setEditingIdea(null);

    setForm(EMPTY_FORM);

    setError("");

    setShowForm(true);
  };

  // ----------------------------------------
  // CREATE / UPDATE IDEA
  // ----------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Idea title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      let response;

      // UPDATE EXISTING IDEA
      if (editingIdea) {
        response = await updateIdea(editingIdea._id, {
          title: form.title.trim(),
          description: form.description.trim(),
          platform: form.platform,
          contentType: form.contentType,
        });

        setIdeas((prev) =>
          prev.map((idea) =>
            idea._id === editingIdea._id ? response.data : idea,
          ),
        );
      }

      // CREATE NEW IDEA
      else {
        response = await createIdea({
          title: form.title.trim(),
          description: form.description.trim(),
          platform: form.platform,
          contentType: form.contentType,
        });

        setIdeas((prev) => [response.data, ...prev]);
      }

      // RESET FORM
      setForm(EMPTY_FORM);

      setEditingIdea(null);

      setShowForm(false);
    } catch (error) {
      console.error(
        editingIdea ? "Failed to update idea:" : "Failed to save idea:",
        error,
      );

      setError(
        error.response?.data?.message ||
          (editingIdea ? "Failed to update idea." : "Failed to save idea."),
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // EDIT IDEA
  // ----------------------------------------

  const handleEdit = (idea) => {
    setEditingIdea(idea);

    setForm({
      title: idea.title || "",
      description: idea.description || "",
      platform: idea.platform || "",
      contentType: idea.contentType || "",
    });

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ----------------------------------------
  // CANCEL FORM
  // ----------------------------------------

  const handleCancel = () => {
    setShowForm(false);

    setEditingIdea(null);

    setForm(EMPTY_FORM);

    setError("");
  };

  // ----------------------------------------
  // DELETE IDEA
  // ----------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?",
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteIdea(id);

      setIdeas((prev) => prev.filter((idea) => idea._id !== id));

      // If the deleted idea was being edited,
      // close the form.
      if (editingIdea?._id === id) {
        handleCancel();
      }
    } catch (error) {
      console.error("Failed to delete idea:", error);

      setError(error.response?.data?.message || "Failed to delete idea.");
    }
  };

  // ----------------------------------------
  // SEARCH
  // ----------------------------------------

  const filteredIdeas = ideas.filter((idea) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return (
      idea.title?.toLowerCase().includes(query) ||
      idea.description?.toLowerCase().includes(query) ||
      idea.platform?.toLowerCase().includes(query) ||
      idea.contentType?.toLowerCase().includes(query)
    );
  });

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div className="space-y-6">
      {/* ----------------------------------------
          HEADER
      ---------------------------------------- */}

      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb size={22} className="text-purple-600" />

            <h1 className="text-2xl font-bold text-gray-900">Saved Ideas</h1>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Keep track of your ideas and turn them into engaging content.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddIdea}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
        >
          <Plus size={18} />
          Add Idea
        </button>
      </section>

      {/* ----------------------------------------
          ERROR
      ---------------------------------------- */}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ----------------------------------------
          ADD / EDIT IDEA FORM
      ---------------------------------------- */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 space-y-5"
        >
          {/* FORM HEADER */}

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editingIdea ? "Edit Idea" : "Add New Idea"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {editingIdea
                ? "Update your saved idea."
                : "Save an idea you can turn into content later."}
            </p>
          </div>

          {/* TITLE */}

          <div>
            <label
              htmlFor="idea-title"
              className="text-sm font-medium text-gray-700"
            >
              Idea Title
            </label>

            <input
              id="idea-title"
              type="text"
              value={form.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              placeholder="e.g. 5 ways creators can use AI"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label
              htmlFor="idea-description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="idea-description"
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              rows={4}
              placeholder="Describe your idea..."
              className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none"
            />
          </div>

          {/* PLATFORM + CONTENT TYPE */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PLATFORM */}

            <div>
              <label
                htmlFor="idea-platform"
                className="text-sm font-medium text-gray-700"
              >
                Platform
              </label>

              <select
                id="idea-platform"
                value={form.platform}
                onChange={(e) => handleFormChange("platform", e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select platform</option>

                <option value="Instagram">Instagram</option>

                <option value="LinkedIn">LinkedIn</option>

                <option value="Twitter">Twitter / X</option>

                <option value="Facebook">Facebook</option>

                <option value="TikTok">TikTok</option>
              </select>
            </div>

            {/* CONTENT TYPE */}

            <div>
              <label
                htmlFor="idea-content-type"
                className="text-sm font-medium text-gray-700"
              >
                Content Type
              </label>

              <select
                id="idea-content-type"
                value={form.contentType}
                onChange={(e) =>
                  handleFormChange("contentType", e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Select type</option>

                <option value="Post">Post</option>

                <option value="Thread">Thread</option>

                <option value="Caption">Caption</option>

                <option value="Article">Article</option>

                <option value="Video Script">Video Script</option>
              </select>
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {saving
                ? editingIdea
                  ? "Updating..."
                  : "Saving..."
                : editingIdea
                  ? "Update Idea"
                  : "Save Idea"}
            </button>
          </div>
        </form>
      )}

      {/* ----------------------------------------
          SEARCH
      ---------------------------------------- */}

      <div className="relative">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search your ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* ----------------------------------------
          LOADING
      ---------------------------------------- */}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-400">Loading your ideas...</p>
        </div>
      ) : filteredIdeas.length === 0 ? (
        /* ----------------------------------------
           EMPTY STATE
        ---------------------------------------- */

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-50 flex items-center justify-center">
            <Lightbulb size={25} className="text-purple-600" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mt-4">
            {search ? "No ideas found" : "No saved ideas yet"}
          </h2>

          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            {search
              ? "Try a different search term."
              : "Save your content ideas here so you can come back and turn them into engaging posts later."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={handleAddIdea}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              <Plus size={17} />
              Add Your First Idea
            </button>
          )}
        </div>
      ) : (
        /* ----------------------------------------
           IDEAS GRID
        ---------------------------------------- */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIdeas.map((idea) => (
            <div
              key={idea._id}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition"
            >
              {/* CARD HEADER */}

              <div className="flex items-start justify-between gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                  <Lightbulb size={19} className="text-yellow-600" />
                </div>

                <div className="flex items-center gap-1">
                  {/* EDIT */}

                  <button
                    type="button"
                    onClick={() => handleEdit(idea)}
                    className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition"
                    aria-label="Edit idea"
                    title="Edit idea"
                  >
                    <Pencil size={17} />
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() => handleDelete(idea._id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    aria-label="Delete idea"
                    title="Delete idea"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {/* TITLE */}

              <h3 className="font-bold text-gray-900 mt-4">{idea.title}</h3>

              {/* DESCRIPTION */}

              {idea.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                  {idea.description}
                </p>
              )}

              {/* TAGS */}

              <div className="flex flex-wrap gap-2 mt-4">
                {idea.platform && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700">
                    {idea.platform}
                  </span>
                )}

                {idea.contentType && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                    {idea.contentType}
                  </span>
                )}
              </div>

              {/* CREATE CONTENT */}

              <Link
                to={`/dashboard/create?idea=${encodeURIComponent(
                  idea.title || "",
                )}&platform=${encodeURIComponent(
                  idea.platform || "",
                )}&contentType=${encodeURIComponent(idea.contentType || "")}`}
                className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
              >
                <Sparkles size={16} />
                Create Content
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ideas;
