import React from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import CreateEditEventForm from "./CreateEditEventForm.jsx";
import { useAppStore } from "../../state/useAppStore.js";

export default function EventList({ events, selectedId, onSelect }) {
  const deleteEvent = useAppStore((s) => s.deleteEvent);

  const [editOpen, setEditOpen] = React.useState(false);
  const [editEvent, setEditEvent] = React.useState(null);

  return (
    <div className="stack">
      {events.map((e) => (
        <Card key={e.id} className={e.id === selectedId ? "cardSelected" : ""}>
          <div className="eventRow">
            <button className="eventMain" onClick={() => onSelect(e.id)} aria-label={`Open ${e.title}`}>
              <div className="eventTitle">{e.title}</div>
              <div className="muted">
                {e.locationName} · {new Date(e.startAt).toLocaleString()}
              </div>
              <div className="pillRow">
                <span className="pill">{e.category}</span>
                {e.distanceKm != null ? <span className="pill muted">{Math.round(e.distanceKm)} km</span> : null}
              </div>
            </button>

            <div className="eventActions">
              <Button
                variant="ghost"
                onClick={() => {
                  setEditEvent(e);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>
              <Button variant="ghost" onClick={() => deleteEvent(e.id)}>
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {events.length === 0 ? <div className="muted">No events match the filters.</div> : null}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit event">
        {editEvent ? <CreateEditEventForm mode="edit" event={editEvent} onDone={() => setEditOpen(false)} /> : null}
      </Modal>
    </div>
  );
}
