import { motion } from "framer-motion";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-300 opacity-30 blur-3xl" />

      <div className="absolute top-20 -right-24 h-80 w-80 rounded-full bg-violet-300 opacity-30 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
