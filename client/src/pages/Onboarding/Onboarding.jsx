import { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import ProgressBar from "../../components/common/ProgressBar";
import WelcomeStep from "../../components/onboarding/WelcomeStep";
import NicheStep from "../../components/onboarding/NicheStep";
import PlatformStep from "../../components/onboarding/PlatformStep";
import PrimaryPlatformStep from "../../components/onboarding/PrimaryPlatformStep";
import GoalsStep from "../../components/onboarding/GoalsStep";
import WritingStyleStep from "../../components/onboarding/WritingStyleStep";
import LocationStep from "../../components/onboarding/LocationStep";
import PostingPreferenceStep from "../../components/onboarding/PostingPreferenceStep";
import BrandVoiceStep from "../../components/onboarding/BrandVoiceStep";
import StepHeader from "../../components/onboarding/StepHeader";
import ProgressTracker from "../../components/onboarding/ProgressTracker";

const TOTAL_STEPS = 9;

const Onboarding = () => {
  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem("creatorflow_step")) || 1;
  });
useEffect(() => {
  localStorage.setItem("creatorflow_step", step);
}, [step]);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("creatorflow_onboarding");

    return saved
      ? JSON.parse(saved)
      : {
          niche: "",
          platforms: [],
          primaryPlatform: "",
          goals: [],
          writingStyle: "",
          country: "",
          timezone: "",
          postingFrequency: "",
          preferredPostingTime: "",
          weeklyContentTime: 0,
          brandVoice: "",
        };
  });
useEffect(() => {
  localStorage.setItem("creatorflow_onboarding", JSON.stringify(formData));
}, [formData]);

 
  const nextStep = () => {
    if (step === 2 && !formData.niche) {
      alert("Please select your niche.");
      return;
    }

    if (step === 3 && formData.platforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }

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
    3: (
      <PlatformStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    4: (
      <PrimaryPlatformStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    5: (
      <GoalsStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    6: (
      <WritingStyleStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    7: (
      <LocationStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    8: (
      <PostingPreferenceStep
        formData={formData}
        updateFormData={updateFormData}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    ),
    9: (
      <BrandVoiceStep
        formData={formData}
        updateFormData={updateFormData}
        previousStep={previousStep}
      />
    ),
  };

  return (
    <div
      className="min-h-dvh w-full bg-[#F8FAFC] flex items-start sm:items-center justify-center overflow-y-auto px-4 pb-6"
      style={{
        paddingTop: "max(1.5rem, calc(env(safe-area-inset-top) + 1rem))",
      }}
    >
      <Card className="w-full max-w-lg my-auto">
        <ProgressTracker currentStep={step} totalSteps={TOTAL_STEPS} />
        <StepHeader step={step} totalSteps={TOTAL_STEPS} />

        <div className="mt-6 sm:mt-8">{steps[step]}</div>
      </Card>
    </div>
  );
};

export default Onboarding;
