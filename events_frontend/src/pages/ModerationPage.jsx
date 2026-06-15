import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";

const TARGET_OPTIONS = [
  { value: "event", label: "Event" },
  { value: "user", label: "User" },
  { value: "comment", label: "Comment" }
];

export default function ModerationPage() {
  const queue = useAppStore((s) => s.moderation.queue);
  const refreshQueue = useAppStore((s) => s.refreshModerationQueue);
  const submitReport = useAppStore((s) => s.submitReport);
  const resolveReport = useAppStore((s) => s.resolveReport);

  const [targetType, setTargetType] = React.useState("event");
  const [targetId, setTargetId] = React.useState("");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Moderation</h1>
        <Button variant="secondary" onClick={refreshQueue}>
          Refresh queue
        </Button>
      </div>

      <Card>
        <h2 style={{ marginTop: 0 }}>Report content</h2>
        <div className="grid2">
          <Select label="Target type" value={targetType} options={TARGET_OPTIONS} onChange={setTargetType} />
          <Input label="Target id" value={targetId} onChange={setTargetId} placeholder="event/user/comment id" />
        </div>
        <Input label="Reason" value={reason} onChange={setReason} placeholder="Describe the issue…" />
        <div className="row">
          <Button
            variant="primary"
            onClick={() => submitReport({ targetType, targetId, reason }).then(() => setReason(""))}
            disabled={!targetId || !reason}
          >
            Submit report
          </Button>
        </div>
      </Card>

      <div className="stack">
        <h2>Queue</h2>
        {queue.map((r) => (
          <Card key={r.id}>
            <div className="moderationRow">
              <div>
                <div className="feedTitle">
                  {r.targetType}:{r.targetId}
                </div>
                <div className="muted">{r.reason}</div>
              </div>
              <div className="row">
                <Button variant="ghost" onClick={() => resolveReport(r.id, "dismissed")}>
                  Dismiss
                </Button>
                <Button variant="secondary" onClick={() => resolveReport(r.id, "actioned")}>
                  Actioned
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {queue.length === 0 ? <div className="muted">No reports in queue.</div> : null}
      </div>
    </div>
  );
}
