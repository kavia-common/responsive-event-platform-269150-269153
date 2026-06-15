import React from "react";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { useAppStore } from "../../state/useAppStore.js";

export default function ProfileForm({ onDone }) {
  const me = useAppStore((s) => s.session.user);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [displayName, setDisplayName] = React.useState(me?.displayName || "");
  const [bio, setBio] = React.useState(me?.bio || "");
  const [busy, setBusy] = React.useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await updateProfile({ displayName, bio });
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <Input label="Display name" value={displayName} onChange={setDisplayName} />
      <Input label="Bio" value={bio} onChange={setBio} placeholder="A short bio…" />
      <div className="row">
        <Button variant="primary" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
