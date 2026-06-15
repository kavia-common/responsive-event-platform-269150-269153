import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import EventMap from "../components/events/EventMap.jsx";
import EventList from "../components/events/EventList.jsx";
import Modal from "../components/ui/Modal.jsx";
import EventDetails from "../components/events/EventDetails.jsx";

export default function DiscoveryPage() {
  const events = useAppStore((s) => s.discovery.events);
  const loading = useAppStore((s) => s.discovery.loading);
  const selectedEventId = useAppStore((s) => s.discovery.selectedEventId);
  const selectEvent = useAppStore((s) => s.selectEvent);

  const selected = events.find((e) => e.id === selectedEventId) || null;

  return (
    <div className="discoveryGrid">
      <section className="mapPane" aria-label="Event map">
        <EventMap events={events} onSelect={(id) => selectEvent(id)} selectedId={selectedEventId} />
      </section>

      <section className="listPane" aria-label="Event list">
        <div className="paneHeader">
          <h1 className="paneTitle">Discover</h1>
          {loading ? <div className="muted">Loading…</div> : <div className="muted">{events.length} events</div>}
        </div>
        <EventList events={events} onSelect={(id) => selectEvent(id)} selectedId={selectedEventId} />
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => selectEvent(null)}
        title={selected ? selected.title : "Event"}
        maxWidthPx={900}
      >
        {selected ? <EventDetails event={selected} /> : null}
      </Modal>
    </div>
  );
}
