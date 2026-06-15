import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function AdminDashboardPage() {
  const stats = useAppStore((s) => s.admin.stats);
  const refresh = useAppStore((s) => s.refreshAdminStats);
  const banUser = useAppStore((s) => s.adminBanUser);
  const deleteEvent = useAppStore((s) => s.adminDeleteEvent);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Admin</h1>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="grid3">
        <Card>
          <div className="kpiLabel">Users</div>
          <div className="kpiValue">{stats.users}</div>
        </Card>
        <Card>
          <div className="kpiLabel">Events</div>
          <div className="kpiValue">{stats.events}</div>
        </Card>
        <Card>
          <div className="kpiLabel">Reports</div>
          <div className="kpiValue">{stats.reports}</div>
        </Card>
      </div>

      <Card>
        <h2 style={{ marginTop: 0 }}>Quick actions</h2>
        <div className="rowWrap">
          <Button variant="ghost" onClick={() => banUser(prompt("User id to ban") || "")}>
            Ban user…
          </Button>
          <Button variant="ghost" onClick={() => deleteEvent(prompt("Event id to delete") || "")}>
            Delete event…
          </Button>
        </div>
        <p className="muted" style={{ marginBottom: 0 }}>
          These actions call admin endpoints if available; otherwise they no-op against the stub API layer.
        </p>
      </Card>
    </div>
  );
}
