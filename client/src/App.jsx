import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Onboarding/Onboarding";
import ProtectedRoute from "./routes/ProtectedRoute";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route path="/onboarding-complete" element={<OnboardingComplete />} />
    </Routes>
  );
}

export default App;
