const AuthCard = ({ children }) => {
  return (
    <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
};

export default AuthCard;
