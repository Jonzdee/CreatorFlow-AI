import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OnboardingComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("creatorflow_step");
      localStorage.removeItem("creatorflow_onboarding");

      navigate("/dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl"
        >
          🎉
        </motion.div>

        <h1 className="text-3xl font-bold mt-8">You're all set!</h1>

        <p className="text-gray-500 mt-3">
          CreatorFlow AI is preparing your workspace...
        </p>

        <div className="mt-10 h-3 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="h-full bg-purple-600"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;
