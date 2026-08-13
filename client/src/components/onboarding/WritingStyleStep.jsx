import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import StepNavigation from "./StepNavigation";
import { WRITING_STYLE_OPTIONS } from "../../../../shared/writingStyles";

const WritingStyleStep = ({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) => {
  const [error, setError] = useState(false);

  const selectStyle = (style) => {
    setError(false);
    updateFormData("writingStyle", style);
  };

  const handleNext = () => {
    if (!formData.writingStyle) {
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
        Choose your writing style
      </h2>

      <p className="text-center text-[#6B7280] mt-2 mb-8">
        CreatorFlow AI will write content in this tone.
      </p>

      <div className="space-y-3">
        {WRITING_STYLE_OPTIONS.map((style) => {
          const selected = formData.writingStyle === style.id;

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => selectStyle(style.id)}
              className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                selected
                  ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                  : "bg-white border-gray-200 hover:border-[#A855F7]"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{style.title}</h3>

                  <p
                    className={`text-sm mt-1 ${
                      selected ? "text-purple-100" : "text-gray-500"
                    }`}
                  >
                    {style.description}
                  </p>
                </div>

                {selected && (
                  <Check size={20} strokeWidth={3} className="text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 text-center mt-4 text-sm">
          Please select a writing style.
        </p>
      )}

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={!formData.writingStyle}
      />
    </motion.div>
  );
};

export default WritingStyleStep;
