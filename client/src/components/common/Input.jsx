import clsx from "clsx";

const Input = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      )}

      <div
        className={clsx(
          "flex items-center h-14 rounded-full border bg-white px-5 transition-all duration-300",
          error
            ? "border-red-500"
            : "border-gray-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100",
          disabled && "bg-gray-100 cursor-not-allowed",
          className,
        )}
      >
        {Icon && <Icon size={18} className="mr-3 text-gray-400" />}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
