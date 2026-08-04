import { motion } from "framer-motion";
import StepNavigation from "./StepNavigation";
import { POSTING_FREQUENCIES } from "../../constants/postingFrequencies";

const PostingPreferenceStep = ({
  formData,
  updateFormData,
  nextStep,
  previousStep,
}) => {
  const handleNext = () => {
    nextStep();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold text-center">Posting Preferences</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Tell us your posting schedule.
      </p>

      {/* Frequency */}

      <div className="space-y-3">
        {POSTING_FREQUENCIES.map((item) => {
          const selected = formData.postingFrequency === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => updateFormData("postingFrequency", item.id)}
              className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                selected
                  ? "bg-purple-600 border-purple-600 text-white"
                  : "border-gray-200"
              }`}
            >
              <h3 className="font-semibold">{item.title}</h3>

              <p
                className={`text-sm ${
                  selected ? "text-purple-100" : "text-gray-500"
                }`}
              >
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Preferred Time */}

      <div className="mt-8">
        <label className="block mb-2 font-medium">Preferred Posting Time</label>

        <input
          type="time"
          value={formData.preferredPostingTime}
          onChange={(e) =>
            updateFormData("preferredPostingTime", e.target.value)
          }
          className="w-full rounded-2xl border p-4"
        />
      </div>

      {/* Weekly Hours */}

      <div className="mt-8">
        <label className="block mb-2 font-medium">
          Hours available each week
        </label>

        <input
          type="number"
          min="0"
          max="100"
          value={formData.weeklyContentTime}
          onChange={(e) =>
            updateFormData("weeklyContentTime", Number(e.target.value))
          }
          className="w-full rounded-2xl border p-4"
        />
      </div>

      <StepNavigation
        onBack={previousStep}
        onNext={handleNext}
        nextDisabled={!formData.postingFrequency}
      />
    </motion.div>
  );
};

export default PostingPreferenceStep;
