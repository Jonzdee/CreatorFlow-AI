const ProgressBar = ({
  progress,
  label,
  showValue = false,
  size = "md",
  safeTop = false,
  className = "",
}) => {
  const clamped = Math.min(100, Math.max(0, progress ?? 0));

  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-2.5",
  };

  return (
    <div
      className={`${safeTop ? "pt-4 sm:pt-6" : ""} ${className}`}
      style={
        safeTop
          ? { paddingTop: "max(1rem, env(safe-area-inset-top))" }
          : undefined
      }
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-[#111827]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-[#7C3AED]">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
        className={`w-full bg-[#E5E7EB] rounded-full overflow-hidden ${heights[size]}`}
      >
        <div
          className={`${heights[size]} rounded-full bg-linear-to-r from-[#EC4899] via-[#A855F7] to-[#7C3AED] transition-[width] duration-500 ease-out motion-reduce:transition-none`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
