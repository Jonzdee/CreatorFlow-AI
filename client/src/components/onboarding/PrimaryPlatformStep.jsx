import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import StepNavigation from "./StepNavigation";
import { PLATFORM_OPTIONS } from "../../../../shared/index.js";

const PrimaryPlatformStep = ({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) => {
  const [error, setError] = useState(false);

  // Only show platforms selected in Step 2
  const selectedPlatforms = PLATFORM_OPTIONS.filter((platform) =>
    formData.platforms.includes(platform.id),
  );

  const selectPlatform = (platformId) => {
    setError(false);
    updateFormData("primaryPlatform", platformId);
  };

  const handleNext = () => {
    if (!formData.primaryPlatform) {
      setError(true);
      return;
    }

    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-center text-[#111827]">
        Choose your primary platform
      </h2>

      <p className="text-center text-[#6B7280] mt-2 mb-8">
        We'll optimise your content for this platform.
      </p>

      <div className="space-y-3">
        {selectedPlatforms.map((platform) => {
          const selected = formData.primaryPlatform === platform.id;
          const Icon = platform.icon;

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => selectPlatform(platform.id)}
              className={`
                w-full
                flex
                items-center
                gap-4
                p-4
                rounded-2xl
                border-2
                transition-all
                duration-200

                ${
                  selected
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                    : "bg-white border-gray-200 hover:border-[#A855F7]"
                }
              `}
            >
              {Icon && (
                <div
                  className={`
                    w-11
                    h-11
                    rounded-xl
                    flex
                    items-center
                    justify-center

                    ${selected ? "bg-white/20" : "bg-[#7C3AED]/10"}
                  `}
                >
                  <Icon
                    size={20}
                    className={selected ? "text-white" : "text-[#7C3AED]"}
                  />
                </div>
              )}

              <span className="flex-1 text-left font-medium">
                {platform.name}
              </span>

              {selected && (
                <Check size={20} strokeWidth={3} className="text-white" />
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-4">
          Please choose your primary platform.
        </p>
      )}

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={!formData.primaryPlatform}
      />
    </motion.div>
  );
};

export default PrimaryPlatformStep;
