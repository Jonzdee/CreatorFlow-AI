import { motion } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";
import Button from "../common/Button";

const FEATURES = [
  "Personalized Content Strategy",
  "AI Optimized Posting Schedule",
  "Platform-Specific Content",
  "Smarter Growth Recommendations",
];

const WelcomeStep = ({ nextStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-center py-3 sm:py-4"
    >
      {/* Icon */}
      <div className="flex justify-center mb-5 sm:mb-6">
        <div className="bg-gradient-to-br from-[#EC4899]/10 via-[#A855F7]/10 to-[#7C3AED]/10 p-3.5 sm:p-4 rounded-full">
          <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#7C3AED]" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-tight px-2">
        Welcome to CreatorFlow AI
      </h1>

      {/* Subtitle */}
      <p className="mt-3 sm:mt-4 text-[15px] sm:text-base text-[#111827]/80 leading-relaxed px-1">
        Let&apos;s build your personal AI Social Media Manager.
      </p>

      {/* Description */}
      <p className="mt-3 sm:mt-4 text-sm sm:text-[15px] text-[#6B7280] leading-relaxed px-1">
        In less than 2 minutes, we&apos;ll learn about your business, audience,
        and goals so CreatorFlow AI can create content that feels like it was
        written by you.
      </p>

      {/* Features */}
      <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3 text-left bg-[#F8FAFC] p-4 sm:p-5 rounded-xl border border-[#E5E7EB]">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-start gap-2.5">
            <CheckCircle2
              size={18}
              className="text-[#7C3AED] shrink-0 mt-0.5"
            />
            <span className="text-sm sm:text-[15px] text-[#111827]">
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="mt-8 sm:mt-10">
        <Button size="lg" onClick={nextStep}>
          Get Started
        </Button>
      </div>
    </motion.div>
  );
};

export default WelcomeStep;
