const VARIANTS = {
  flat: "bg-white border border-[#E5E7EB]",
  elevated:
    "bg-white shadow-md shadow-[#111827]/5 hover:shadow-lg hover:shadow-[#111827]/8",
  glow: "bg-white border border-[#E5E7EB]/60 shadow-lg shadow-[#7C3AED]/10",
};

const PADDING = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

const Card = ({
  children,
  variant = "elevated",
  padding = "md",
  as: Tag = "div",
  className = "",
  ...rest
}) => {
  return (
    <Tag
      className={`
        rounded-2xl sm:rounded-3xl
        transition-shadow duration-200
        ${VARIANTS[variant]}
        ${PADDING[padding]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Card;
