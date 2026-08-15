import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Button from "../common/Button";
import SelectableCard from "../common/SelectableCard";
import { NICHES } from "@shared/niches.js";
import { NICHE_ICONS } from "../../constants/nicheIcons.js";
import StepNavigation from "./StepNavigation";

const NicheStep = ({ formData, updateFormData, nextStep, previousStep }) => {
  const [error, setError] = useState(false);

  const handleSelect = (title) => {
    setError(false);
    updateFormData("niche", title);
  };

  const handleNext = () => {
    if (!formData.niche) {
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
      className="w-full pt-5 sm:pt-8"
    >
      <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-center text-[#111827] px-2">
        What&apos;s your niche?
      </h2>

      <p className="text-center text-[#6B7280] text-[13px] sm:text-base mt-2 mb-5 sm:mb-8 px-3">
        This helps CreatorFlow AI understand your audience.
      </p>

      <div
        role="radiogroup"
        aria-label="Select your niche"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        {NICHES.map((niche) => {
          const Icon = NICHE_ICONS[niche.id];

          return (
            <SelectableCard
              key={niche.id}
              title={niche.title}
              description={niche.description}
              icon={<Icon size={28} />}
              selected={formData.niche === niche.id}
              onClick={() => handleSelect(niche.id)}
            />
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-center text-sm text-red-500 mt-4 px-3">
          Please select your niche to continue.
        </p>
      )}

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={!formData.niche}
      />
    </motion.div>
  );
};

export default NicheStep;
