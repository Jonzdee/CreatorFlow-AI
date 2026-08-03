const AuthHeader = ({ title, subtitle }) => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
          ✨ CreatorFlow AI
        </h1>

        <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>

        <p className="mt-3 text-gray-500">{subtitle}</p>
      </div>
    </>
  );
};

export default AuthHeader;
