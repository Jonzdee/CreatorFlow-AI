const AuthCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-3xl sm:rounded-4xl
        bg-gray-50/20
        p-5 sm:p-8
        shadow-[0_20px_60px_rgba(124,58,237,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AuthCard;
