import { Sparkles } from "lucide-react";

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center gap-1.5">
        <Sparkles size={20} className="text-[#A855F7] shrink-0" />
        <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#EC4899] via-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent">
          CreatorFlow AI
        </span>
      </div>

      <h1 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-[#111827] leading-tight px-2">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#6B7280] px-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
