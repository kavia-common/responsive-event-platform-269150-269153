import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import DiscoveryPage from "./pages/DiscoveryPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import ModerationPage from "./pages/ModerationPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AnalyticsDashboardPage from "./pages/AnalyticsDashboardPage.jsx";
import { useAppStore } from "./state/useAppStore.js";

export default function App() {
  const init = useAppStore((s) => s.init);
  React.useEffect(() => {
    init();
  }, [init]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/discover" replace />} />
        <Route path="/discover" element={<DiscoveryPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/moderation" element={<ModerationPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
      </Routes>
    </AppShell>
  );
}
