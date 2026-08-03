import { CheckCircle2 } from "lucide-react";

const SelectableCard = ({
  title,
  description,
  icon,
  selected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        w-full
        rounded-2xl
        border-2
        p-5
        text-left
        transition-all
        duration-200
        hover:shadow-lg
        ${
          selected
            ? "border-purple-600 bg-purple-50"
            : "border-gray-200 bg-white hover:border-purple-300"
        }
      `}
    >
      {/* Selected Icon */}
      {selected && (
        <CheckCircle2
          size={22}
          className="absolute top-4 right-4 text-purple-600"
        />
      )}

      {/* Card Icon */}
      <div className="mb-4 text-purple-600">{icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </button>
  );
};

export default SelectableCard;
