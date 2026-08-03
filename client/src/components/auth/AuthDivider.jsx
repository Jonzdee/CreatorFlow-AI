const AuthDivider = ({ text = "or continue with" }) => {
  return (
    <div className="my-6 flex items-center">
      <div className="h-px flex-1 bg-gray-200" />

      <span className="mx-4 text-sm text-gray-400">{text}</span>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
};

export default AuthDivider;
