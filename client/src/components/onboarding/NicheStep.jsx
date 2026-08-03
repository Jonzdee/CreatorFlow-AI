import Button from "../common/Button";
import SelectableCard from "../common/SelectableCard";
import { NICHES } from "../../constants/niches";

const NicheStep = ({ formData, updateFormData, nextStep, previousStep }) => {
  const handleNext = () => {
    if (!formData.niche) {
      alert("Please select your niche.");
      return;
    }

    nextStep();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">What's your niche?</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        This helps CreatorFlow AI understand your audience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NICHES.map((niche) => {
          const Icon = niche.icon;

          return (
            <SelectableCard
              key={niche.title}
              title={niche.title}
              description={niche.description}
              icon={<Icon size={28} />}
              selected={formData.niche === niche.title}
              onClick={() => updateFormData("niche", niche.title)}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-10">
        <Button variant="outline" onClick={previousStep}>
          Back
        </Button>

        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
};

export default NicheStep;
