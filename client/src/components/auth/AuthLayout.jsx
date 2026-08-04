import { motion, useReducedMotion } from "framer-motion";

const AuthLayout = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-linear-to-br from-[#FDF2F8] via-[#FAF5FF] to-white">
      {/* Background glow */}
      <div className="absolute -top-16 -left-16 h-56 w-56 sm:-top-24 sm:-left-24 sm:h-72 sm:w-72 rounded-full bg-[#EC4899]/25 blur-3xl" />
      <div className="absolute top-16 -right-16 h-64 w-64 sm:top-20 sm:-right-24 sm:h-80 sm:w-80 rounded-full bg-[#7C3AED]/25 blur-3xl" />

      <div
        className="relative z-10 flex min-h-dvh w-full items-start sm:items-center justify-center overflow-y-auto px-5 pb-8"
        style={{
          paddingTop: "max(2.5rem, calc(env(safe-area-inset-top) + 1.5rem))",
        }}
      >
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md my-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
