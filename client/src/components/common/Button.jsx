import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-pink-500 via-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl",

    secondary: "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50",

    danger: "bg-red-600 text-white hover:bg-red-700",

    outline: "border border-violet-500 text-violet-600 hover:bg-violet-50",

    ghost: "bg-transparent text-violet-600 hover:bg-violet-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex
        items-center
        justify-center
        gap-2
        w-full
        h-14
        rounded-full
        font-semibold
        transition-all
        duration-300
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-70
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
