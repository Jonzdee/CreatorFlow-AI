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

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const steps = {
    1: <WelcomeStep nextStep={nextStep} />,
    2: (
      <NicheStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    3: <div>Platform Step</div>,
    4: <div>Primary Platform Step</div>,
    5: <div>Goals Step</div>,
    6: <div>Writing Style Step</div>,
    7: <div>Location Step</div>,
    8: <div>Posting Preferences Step</div>,
    9: <div>Finish Step</div>,
  };

  return (
    <div
      className="min-h-dvh w-full bg-[#F8FAFC] flex items-start sm:items-center justify-center overflow-y-auto px-4 pb-6"
      style={{
        paddingTop: "max(1.5rem, calc(env(safe-area-inset-top) + 1rem))",
      }}
    >
      <Card className="w-full max-w-lg my-auto">
        <ProgressBar progress={progress} />

        <p className="text-center text-sm text-[#6B7280] mt-3 sm:mt-4">
          Step {step} of {TOTAL_STEPS}
        </p>

        <div className="mt-6 sm:mt-8">{steps[step]}</div>
      </Card>
    </div>
  );
};

export default Onboarding;
