import { useState } from "react";
import Card from "../../components/common/Card";
import ProgressBar from "../../components/common/ProgressBar";
import WelcomeStep from "../../components/onboarding/WelcomeStep";
import NicheStep from "../../components/onboarding/NicheStep";

const TOTAL_STEPS = 9;

const Onboarding = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    niche: "",
    platforms: [],
    primaryPlatform: "",
    goals: [],
    writingStyle: "Friendly",
    country: "",
    timezone: "",
    postingFrequency: "",
    preferredPostingTime: "",
    weeklyContentTime: 0,
    brandVoice: "",
  });

  // Progress
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  // Go to next step
  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  // Go to previous step
  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Update form data
  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render onboarding steps
  const steps = {
    1: <WelcomeStep nextStep={nextStep} />,

    // We'll build these next
    2: <NicheStep
      formData={formData}
      updateFormData={updateFormData}
      nextStep={nextStep}
      previousStep={previousStep}
    />,
    3: <div>Platform Step</div>,
    4: <div>Primary Platform Step</div>,
    5: <div>Goals Step</div>,
    6: <div>Writing Style Step</div>,
    7: <div>Location Step</div>,
    8: <div>Posting Preferences Step</div>,
    9: <div>Finish Step</div>,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <ProgressBar progress={progress} />

        <p className="text-center text-sm text-gray-500 mt-4">
          Step {step} of {TOTAL_STEPS}
        </p>

        <div className="mt-8">{steps[step]}</div>
      </Card>
    </div>
  );
};

export default Onboarding;
