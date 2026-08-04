import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

const VARIANTS = {
  primary:
    "text-white bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#7C3AED] shadow-lg shadow-[#7C3AED]/25 hover:shadow-xl hover:shadow-[#7C3AED]/35",
  secondary:
    "bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F8FAFC]",
  outline:
    "bg-transparent text-[#7C3AED] border border-[#7C3AED] hover:bg-[#7C3AED]/5",
  ghost: "bg-transparent text-[#7C3AED] hover:bg-[#7C3AED]/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-xs gap-1.5 sm:h-10 sm:px-4 sm:text-sm",
  md: "h-11 px-4 text-sm gap-1.5 sm:h-12 sm:px-6 sm:text-[15px]",
  lg: "h-12 px-5 text-[15px] gap-2 sm:h-14 sm:px-8 sm:text-base",
};

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      onClick,
      disabled = false,
      loading = false,
      variant = "primary",
      size = "lg",
      icon: Icon,
      iconPosition = "left",
      fullWidth = true,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          ${fullWidth ? "w-full" : ""}
          ${SIZES[size]}
          rounded-full font-semibold
          transition-[transform,box-shadow,opacity] duration-200 ease-out
          motion-reduce:transition-none motion-reduce:hover:scale-100
          hover:scale-[1.02] active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8FAFC]
          disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
          ${VARIANTS[variant]}
          ${className}
        `}
        {...rest}
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin motion-reduce:animate-none"
            />
            <span>Please wait...</span>
          </>
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon size={18} />}
            <span>{children}</span>
            {Icon && iconPosition === "right" && <Icon size={18} />}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
