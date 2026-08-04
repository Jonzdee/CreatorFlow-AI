import { CheckCircle2 } from "lucide-react";

const SelectableCard = ({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`
        relative w-full rounded-2xl border-2 p-4 sm:p-5 text-left
        transition-all duration-200
        hover:shadow-lg hover:shadow-[#7C3AED]/8
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none
        ${
          selected
            ? "border-[#7C3AED] bg-[#7C3AED]/5"
            : "border-[#E5E7EB] bg-white hover:border-[#A855F7]/40"
        }
        ${className}
      `}
    >
      {/* Selected indicator */}
      {selected && (
        <CheckCircle2
          size={20}
          className="absolute top-4 right-4 text-[#7C3AED] fill-[#7C3AED]/15"
        />
      )}

      {/* Icon */}
      {icon && (
        <div
          className={`
            mb-3 sm:mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl
            transition-colors duration-200
            ${selected ? "bg-[#7C3AED] text-white" : "bg-[#7C3AED]/8 text-[#7C3AED]"}
          `}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-[#111827] pr-6">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1.5 sm:mt-2 text-sm text-[#6B7280] leading-relaxed">
          {description}
        </p>
      )}
    </button>
  );
};

export default SelectableCard;
