import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function AnalyticsDashboardPage() {
  const analytics = useAppStore((s) => s.analytics);
  const refresh = useAppStore((s) => s.refreshAnalytics);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Analytics</h1>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="grid3">
        <Card>
          <div className="kpiLabel">RSVPs (7d)</div>
          <div className="kpiValue">{analytics.rsvps7d}</div>
        </Card>
        <Card>
          <div className="kpiLabel">New events (7d)</div>
          <div className="kpiValue">{analytics.newEvents7d}</div>
        </Card>
        <Card>
          <div className="kpiLabel">Active chat rooms</div>
          <div className="kpiValue">{analytics.activeRooms}</div>
        </Card>
      </div>

      <Card>
        <h2 style={{ marginTop: 0 }}>Notes</h2>
        <p className="muted" style={{ marginBottom: 0 }}>
          This dashboard is intentionally lightweight and uses backend-provided aggregates when available.
        </p>
      </Card>
    </div>
  );
}
