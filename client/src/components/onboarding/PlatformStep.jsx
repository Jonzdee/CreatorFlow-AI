import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import StepNavigation from "./StepNavigation";
import { PLATFORM_OPTIONS } from "../../../../shared/platforms";

const PlatformStep = ({ formData, updateFormData, nextStep, previousStep }) => {
  const [error, setError] = useState(false);

  const togglePlatform = (platformId) => {
    setError(false);
    const selectedPlatforms = formData.platforms;

    if (selectedPlatforms.includes(platformId)) {
      updateFormData(
        "platforms",
        selectedPlatforms.filter((item) => item !== platformId),
      );
    } else {
      updateFormData("platforms", [...selectedPlatforms, platformId]);
    }
  };

  const handleNext = () => {
    if (formData.platforms.length === 0) {
      setError(true);
      return;
    }
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <h2 className="text-lg sm:text-2xl font-bold text-center text-[#111827] px-2">
        Where do you create content?
      </h2>

      <p className="text-center text-[#6B7280] text-[13px] sm:text-base mt-2 mb-5 sm:mb-8 px-3">
        Select all the platforms you use.
      </p>

      <div
        role="group"
        aria-label="Select your platforms"
        className="space-y-2.5 sm:space-y-3"
      >
        {PLATFORM_OPTIONS.map((platform) => {
          const selected = formData.platforms.includes(platform.id);
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => togglePlatform(platform.id)}
              className={`
                w-full flex items-center gap-3 rounded-2xl border-2 p-3.5 sm:p-4 text-left
                transition-all duration-200
                hover:shadow-md hover:shadow-[#7C3AED]/8
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2
                ${
                  selected
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                    : "bg-white border-[#E5E7EB] text-[#111827] hover:border-[#A855F7]/40"
                }
              `}
            >
              {Icon && (
                <span
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${
                    selected ? "bg-white/15" : "bg-[#7C3AED]/8"
                  }`}
                >
                  <Icon
                    size={18}
                    className={selected ? "text-white" : "text-[#7C3AED]"}
                  />
                </span>
              )}

              <span className="flex-1 text-sm sm:text-base font-medium">
                {platform.name}
              </span>

              <span
                className={`
                  flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors
                  ${selected ? "bg-white border-white" : "border-[#E5E7EB]"}
                `}
              >
                {selected && (
                  <Check size={14} className="text-[#7C3AED]" strokeWidth={3} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-center text-sm text-red-500 mt-4 px-3">
          Please select at least one platform to continue.
        </p>
      )}

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={formData.platforms.length === 0}
      />
    </motion.div>
  );
};

export default PlatformStep;
