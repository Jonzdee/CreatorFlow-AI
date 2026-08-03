import { FcGoogle } from "react-icons/fc";

const SocialButton = () => {
  return (
    <button
      type="button"
      className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white font-medium text-gray-700 transition hover:bg-gray-50"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
};

export default SocialButton;
