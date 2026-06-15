import React from "react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { useAppStore } from "../../state/useAppStore.js";

const CATEGORY_OPTIONS = [
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "tech", label: "Tech" },
  { value: "food", label: "Food" },
  { value: "community", label: "Community" }
];

export default function CreateEditEventForm({ mode, event, onDone }) {
  const createEvent = useAppStore((s) => s.createEvent);
  const updateEvent = useAppStore((s) => s.updateEvent);

  const [title, setTitle] = React.useState(event?.title || "");
  const [description, setDescription] = React.useState(event?.description || "");
  const [category, setCategory] = React.useState(event?.category || "community");
  const [locationName, setLocationName] = React.useState(event?.locationName || "");
  const [lat, setLat] = React.useState(event?.lat != null ? String(event.lat) : "");
  const [lng, setLng] = React.useState(event?.lng != null ? String(event.lng) : "");
  const [startAt, setStartAt] = React.useState(event?.startAt ? event.startAt.slice(0, 16) : "");
  const [imageUrl, setImageUrl] = React.useState(event?.imageUrl || "");

  const [busy, setBusy] = React.useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const payload = {
        title,
        description,
        category,
        locationName,
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        startAt: startAt ? new Date(startAt).toISOString() : new Date().toISOString(),
        imageUrl: imageUrl || ""
      };
      if (mode === "edit" && event?.id) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <Input label="Title" value={title} onChange={setTitle} placeholder="Event title" />
      <Input label="Description" value={description} onChange={setDescription} placeholder="What’s happening?" />
      <Select label="Category" value={category} options={CATEGORY_OPTIONS} onChange={setCategory} />
      <Input label="Location name" value={locationName} onChange={setLocationName} placeholder="Venue / neighborhood" />

      <div className="grid2">
        <Input label="Latitude" value={lat} onChange={setLat} placeholder="e.g. 37.7749" />
        <Input label="Longitude" value={lng} onChange={setLng} placeholder="e.g. -122.4194" />
      </div>

      <Input label="Start time" type="datetime-local" value={startAt} onChange={setStartAt} />
      <Input label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://…" />

      <div className="row">
        <Button variant="primary" onClick={submit} disabled={busy || !title.trim()}>
          {busy ? "Saving…" : mode === "edit" ? "Save changes" : "Create"}
        </Button>
      </div>

      <p className="muted">
        Image uploads can be integrated once the backend supports an upload endpoint; this form currently accepts an image URL.
      </p>
    </div>
  );
}
