import { useState } from "react";
import { Bot } from "lucide-react";
import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/dashboad/DashboardSidebar";
import DashboardHeader from "../components/dashboad/DashboardHeader";
import CreatorAssistant from "../components/ai/CreatorAssistant";

const DashboardLayout = () => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CreatorFlow AI state
  const [assistantOpen, setAssistantOpen] = useState(false);

  // ----------------------------------------
  // OPEN AI ASSISTANT
  // ----------------------------------------

  const openAssistant = () => {
    setAssistantOpen(true);
  };

  // ----------------------------------------
  // CLOSE AI ASSISTANT
  // ----------------------------------------

  const closeAssistant = () => {
    setAssistantOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ========================================
          MAIN AREA
      ======================================== */}

      <div className="lg:ml-72 min-h-screen flex flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* ========================================
          CREATORFLOW AI
      ======================================== */}

      {assistantOpen && <CreatorAssistant onClose={closeAssistant} />}

      {/* ========================================
          FLOATING AI BUTTON
          ONLY SHOW WHEN CHAT IS CLOSED
      ======================================== */}

      {!assistantOpen && (
        <button
          type="button"
          onClick={openAssistant}
          className="
            fixed
            bottom-5
            right-5
            z-[9998]
            w-14
            h-14
            rounded-full
            bg-purple-600
            text-white
            shadow-lg
            flex
            items-center
            justify-center
            hover:bg-purple-700
            active:scale-95
            transition
            cursor-pointer
          "
          aria-label="Open CreatorFlow AI"
          title="Open CreatorFlow AI"
        >
          <Bot size={25} />
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;
