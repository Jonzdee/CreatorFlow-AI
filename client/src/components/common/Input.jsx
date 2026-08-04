import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      value,
      onChange,
      error,
      hint,
      icon: Icon,
      rightSlot,
      disabled = false,
      required = false,
      autoComplete,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = name || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-semibold text-[#111827] sm:mb-2"
          >
            {label}
            {required && <span className="ml-0.5 text-[#EC4899]">*</span>}
          </label>
        )}

        <div
          className={clsx(
            "flex h-12 items-center rounded-full border bg-white px-4 transition-all duration-200 sm:h-14 sm:px-5",
            error
              ? "border-red-500 focus-within:ring-4 focus-within:ring-red-100"
              : "border-[#E5E7EB] focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-[#7C3AED]/10",
            disabled && "cursor-not-allowed bg-[#F8FAFC] opacity-70",
            className,
          )}
        >
          {Icon && (
            <Icon
              size={18}
              className="mr-2.5 shrink-0 text-[#6B7280] sm:mr-3"
            />
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={resolvedType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className="w-full min-w-0 bg-transparent text-[16px] text-[#111827] outline-none placeholder:text-[#6B7280] disabled:cursor-not-allowed"
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
              className="ml-2 shrink-0 text-[#6B7280] hover:text-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-full p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {!isPassword && rightSlot && (
            <div className="ml-2 shrink-0">{rightSlot}</div>
          )}
        </div>

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="mt-1.5 text-sm text-red-500 sm:mt-2"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="mt-1.5 text-sm text-[#6B7280] sm:mt-2">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
