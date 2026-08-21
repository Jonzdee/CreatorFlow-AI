import { useEffect, useState } from "react";
import { CalendarDays, Clock, X } from "lucide-react";

const ScheduleModal = ({ open, onClose, onSchedule, loading = false }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDate("");
      setTime("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }

    const scheduledDate = new Date(`${date}T${time}`);

    if (Number.isNaN(scheduledDate.getTime())) {
      setError("Please select a valid date and time.");
      return;
    }

    if (scheduledDate <= new Date()) {
      setError("Please choose a future date and time.");
      return;
    }

    onSchedule(scheduledDate.toISOString());
  };

  const formatPreview = () => {
    if (!date || !time) return "";

    const selectedDate = new Date(`${date}T${time}`);

    if (Number.isNaN(selectedDate.getTime())) return "";

    return selectedDate.toLocaleString("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Schedule Content
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Choose when you want this content to be published.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-gray-700"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-gray-700"
              />
            </div>
          </div>

          {/* Preview */}
          {formatPreview() && (
            <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
              <p className="text-xs font-medium text-purple-600 mb-1">
                Scheduled for
              </p>

              <p className="text-sm font-semibold text-purple-900">
                {formatPreview()}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? "Scheduling..." : "Schedule Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
