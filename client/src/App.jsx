import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Onboarding/Onboarding";
import OnboardingComplete from "./pages/Onboarding/OnboardingComplete";

import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateContent from "./pages/Dashboard/CreateContent";

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route path="/onboarding-complete" element={<OnboardingComplete />} />

      {/* Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<CreateContent />} />
      </Route>
    </Routes>
  );
}

export default App;
