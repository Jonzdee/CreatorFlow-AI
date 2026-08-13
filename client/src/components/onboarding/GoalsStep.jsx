import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import StepNavigation from "./StepNavigation";
import { GOAL_OPTIONS } from "../../../../shared/goals";

const GoalsStep = ({ formData, updateFormData, nextStep, previousStep }) => {
  const [error, setError] = useState(false);

  const toggleGoal = (goalId) => {
    setError(false);

    const selectedGoals = formData.goals;

    if (selectedGoals.includes(goalId)) {
      updateFormData(
        "goals",
        selectedGoals.filter((goal) => goal !== goalId),
      );
    } else {
      updateFormData("goals", [...selectedGoals, goalId]);
    }
  };

  const handleNext = () => {
    if (formData.goals.length === 0) {
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
        What are your goals?
      </h2>

      <p className="text-center text-[#6B7280] mt-2 mb-8">
        Select all that apply.
      </p>

      <div className="space-y-3">
        {GOAL_OPTIONS.map((goal) => {
          const selected = formData.goals.includes(goal.id);

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={`
                w-full
                rounded-2xl
                border-2
                p-4
                text-left
                transition-all

                ${
                  selected
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                    : "bg-white border-gray-200 hover:border-[#A855F7]"
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-base">{goal.title}</h3>

                  <p
                    className={`text-sm mt-1 ${
                      selected ? "text-purple-100" : "text-gray-500"
                    }`}
                  >
                    {goal.description}
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
          Please choose at least one goal.
        </p>
      )}

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={formData.goals.length === 0}
      />
    </motion.div>
  );
};

export default GoalsStep;
