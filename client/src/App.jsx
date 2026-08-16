import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Onboarding from "./pages/Onboarding/Onboarding";
import OnboardingComplete from "./pages/Onboarding/OnboardingComplete";

import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateContent from "./pages/Dashboard/CreateContent";
import Content from "./pages/Dashboard/Content";
import Calendar from "./pages/Dashboard/Calendar";
import Analytics from "./pages/Dashboard/Analytics";
import Profile from "./pages/Dashboard/Profile";

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
        <Route path="/dashboard/content" element={<Content />} />
        <Route path="/dashboard/calendar" element={<Calendar />} />
        <Route path="/dashboard/analytics" element={<Analytics />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
