import React from "react";
import TopNav from "./TopNav.jsx";
import FiltersSidebar from "./FiltersSidebar.jsx";
import ChatDrawer from "../messaging/ChatDrawer.jsx";
import { useAppStore } from "../../state/useAppStore.js";

export default function AppShell({ children }) {
  const sidebarOpen = useAppStore((s) => s.ui.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const chatOpen = useAppStore((s) => s.ui.chatOpen);
  const setChatOpen = useAppStore((s) => s.setChatOpen);

  return (
    <div className="appRoot">
      <TopNav
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleChat={() => setChatOpen(!chatOpen)}
      />

      <div className="appBody">
        <aside className={sidebarOpen ? "sidebar sidebarOpen" : "sidebar"}>
          <FiltersSidebar />
        </aside>

        <main className="main">{children}</main>
      </div>

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
