import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StepNavigation from "./StepNavigation";
import { completeOnboarding } from "../../services/userService";

const BrandVoiceStep = ({ formData, updateFormData, previousStep }) => {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  try {
    setLoading(true);

    console.log("Submitting onboarding...");

    const response = console.log("Submitting:", formData);

    await completeOnboarding(formData);

    console.log("API Success:", response);

    console.log("Navigating to completion page...");

    navigate("/onboarding-complete");
  } catch (error) {
    console.error("Status:", error.response?.status);
    console.error("Response:", error.response?.data);

    alert(JSON.stringify(error.response?.data, null, 2));
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-center">Describe your brand</h2>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Tell CreatorFlow AI how you want your content to sound.
      </p>

      <textarea
        rows={7}
        placeholder="Example: I help small business owners grow online using practical marketing tips. My content should sound friendly, trustworthy and easy to understand."
        value={formData.brandVoice}
        onChange={(e) => updateFormData("brandVoice", e.target.value)}
        className="w-full rounded-2xl border p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <StepNavigation
        onBack={previousStep}
        onNext={handleSubmit}
        nextText={loading ? "Finishing..." : "Finish"}
        nextDisabled={!formData.brandVoice.trim() || loading}
      />
    </motion.div>
  );
};

export default BrandVoiceStep;
