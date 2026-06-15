import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function NotificationsPage() {
  const notifications = useAppStore((s) => s.notifications.items);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const refresh = useAppStore((s) => s.refreshNotifications);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Notifications</h1>
        <div className="row">
          <Button variant="secondary" onClick={refresh}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={markAllRead}>
            Mark all read
          </Button>
        </div>
      </div>

      <div className="stack">
        {notifications.map((n) => (
          <Card key={n.id}>
            <div className="notifRow">
              <div>
                <div className="notifTitle">{n.title}</div>
                <div className="muted">{n.body}</div>
              </div>
              <div className="muted">{n.read ? "Read" : "Unread"}</div>
            </div>
          </Card>
        ))}
        {notifications.length === 0 ? <div className="muted">No notifications.</div> : null}
      </div>
    </div>
  );
}
