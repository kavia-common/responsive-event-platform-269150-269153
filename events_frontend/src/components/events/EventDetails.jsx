import React from "react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import Input from "../ui/Input.jsx";
import { useAppStore } from "../../state/useAppStore.js";

export default function EventDetails({ event }) {
  const rsvpStatus = useAppStore((s) => s.rsvp.byEventId[event.id]?.status || "none");
  const setRsvp = useAppStore((s) => s.setRsvp);
  const attendees = useAppStore((s) => s.rsvp.byEventId[event.id]?.attendees || []);
  const loadComments = useAppStore((s) => s.loadComments);
  const comments = useAppStore((s) => s.comments.byEventId[event.id] || []);
  const postComment = useAppStore((s) => s.postComment);
  const submitReport = useAppStore((s) => s.submitReport);

  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    loadComments(event.id);
  }, [event.id, loadComments]);

  return (
    <div className="detailsGrid">
      <div className="detailsMain">
        <Card>
          <div className="detailsHeader">
            <div>
              <div className="detailsTitle">{event.title}</div>
              <div className="muted">
                {event.locationName} · {new Date(event.startAt).toLocaleString()}
              </div>
            </div>
            <div className="row">
              <Button variant={rsvpStatus === "going" ? "secondary" : "primary"} onClick={() => setRsvp(event.id, "going")}>
                RSVP Going
              </Button>
              <Button variant={rsvpStatus === "interested" ? "secondary" : "ghost"} onClick={() => setRsvp(event.id, "interested")}>
                Interested
              </Button>
            </div>
          </div>

          <p style={{ marginTop: 12 }}>{event.description || "No description provided."}</p>

          <div className="pillRow" style={{ marginTop: 10 }}>
            <span className="pill">{event.category}</span>
            {event.distanceKm != null ? <span className="pill muted">{Math.round(event.distanceKm)} km away</span> : null}
          </div>
        </Card>

        <Card>
          <div className="rowBetween">
            <h2 style={{ margin: 0 }}>Chat / Comments</h2>
            <Button variant="ghost" onClick={() => submitReport({ targetType: "event", targetId: event.id, reason: "Reported from event details" })}>
              Report
            </Button>
          </div>

          <div className="chatThread" role="log" aria-label="Event chat thread">
            {comments.map((c) => (
              <div key={c.id} className="chatMsg">
                <div className="chatMeta">
                  <span className="chatAuthor">{c.authorName}</span>
                  <span className="muted">{new Date(c.createdAt).toLocaleTimeString()}</span>
                </div>
                <div>{c.body}</div>
              </div>
            ))}
            {comments.length === 0 ? <div className="muted">No comments yet.</div> : null}
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <Input label="Write a comment" value={comment} onChange={setComment} placeholder="Say something…" />
            <div style={{ alignSelf: "flex-end" }}>
              <Button
                variant="primary"
                onClick={() => postComment(event.id, comment).then(() => setComment(""))}
                disabled={!comment.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="detailsSide">
        <Card>
          <h2 style={{ marginTop: 0 }}>Attendees</h2>
          <div className="stack">
            {attendees.map((a) => (
              <div key={a.userId} className="attendeeRow">
                <span className="avatarCircleSmall">{a.name.slice(0, 1).toUpperCase()}</span>
                <span>{a.name}</span>
              </div>
            ))}
            {attendees.length === 0 ? <div className="muted">No attendees yet.</div> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
