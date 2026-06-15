import React from "react";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Card from "../ui/Card.jsx";
import { useAppStore } from "../../state/useAppStore.js";

export default function ChatDrawer({ open, onClose }) {
  const rooms = useAppStore((s) => s.chat.rooms);
  const activeRoomId = useAppStore((s) => s.chat.activeRoomId);
  const messages = useAppStore((s) => (activeRoomId ? s.chat.messagesByRoomId[activeRoomId] || [] : []));
  const setActiveRoom = useAppStore((s) => s.setActiveChatRoom);
  const sendMessage = useAppStore((s) => s.sendChatMessage);

  const [text, setText] = React.useState("");

  return (
    <div className={open ? "chatDrawer open" : "chatDrawer"} aria-hidden={!open}>
      <div className="chatHeader">
        <div style={{ fontWeight: 800 }}>Chat</div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="chatBody">
        <div className="chatRooms">
          {rooms.map((r) => (
            <button
              key={r.id}
              className={r.id === activeRoomId ? "chatRoom active" : "chatRoom"}
              onClick={() => setActiveRoom(r.id)}
            >
              <div className="chatRoomTitle">{r.title}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {r.subtitle}
              </div>
            </button>
          ))}
          {rooms.length === 0 ? <div className="muted">No rooms yet. Open an event to start chatting.</div> : null}
        </div>

        <div className="chatMessages">
          <Card className="chatMessagesCard">
            <div className="chatThread" role="log" aria-label="Chat messages">
              {messages.map((m) => (
                <div key={m.id} className="chatMsg">
                  <div className="chatMeta">
                    <span className="chatAuthor">{m.authorName}</span>
                    <span className="muted">{new Date(m.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div>{m.body}</div>
                </div>
              ))}
              {messages.length === 0 ? <div className="muted">No messages.</div> : null}
            </div>
          </Card>

          <div className="row" style={{ padding: 12 }}>
            <Input label="Message" value={text} onChange={setText} placeholder="Type a message…" />
            <div style={{ alignSelf: "flex-end" }}>
              <Button
                variant="primary"
                disabled={!activeRoomId || !text.trim()}
                onClick={() => sendMessage(activeRoomId, text).then(() => setText(""))}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
