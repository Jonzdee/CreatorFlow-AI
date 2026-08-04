import { motion } from "framer-motion";

const ProgressTracker = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;

          const completed = step < currentStep;
          const active = step === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.15 : 1,
                }}
                transition={{
                  duration: 0.25,
                }}
                className={`
                  w-4
                  h-4
                  rounded-full
                  z-10

                  ${
                    completed
                      ? "bg-[#7C3AED]"
                      : active
                        ? "bg-[#7C3AED] ring-4 ring-purple-200"
                        : "bg-gray-300"
                  }
                `}
              />

              {step !== totalSteps && (
                <div
                  className={`
                    flex-1
                    h-1

                    ${completed ? "bg-[#7C3AED]" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProgressTracker;
