class WsManager {
  constructor() {
    this.ws = null;
    this.handlers = null;
    this.connected = false;
    this._retryTimer = null;
  }

  envWsUrl() {
    // Vite uses VITE_*, but container .env uses REACT_APP_*; we accept both.
    return (
      import.meta.env.VITE_WS_URL ||
      (typeof process !== "undefined" ? process.env?.REACT_APP_WS_URL : undefined) ||
      "ws://localhost:3001/ws"
    );
  }

  // PUBLIC_INTERFACE
  connect({ url, onNotification, onChatMessage }) {
    /** Connect to backend websocket for real-time notifications and chat. */
    this.handlers = { onNotification, onChatMessage };
    if (!url) return;
    this._connectInternal(url);
  }

  _connectInternal(url) {
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        this.connected = true;
      };
      this.ws.onclose = () => {
        this.connected = false;
        this._scheduleReconnect(url);
      };
      this.ws.onerror = () => {
        // Allow onclose to trigger reconnect
      };
      this.ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          this._routeMessage(msg);
        } catch {
          // ignore malformed
        }
      };
    } catch {
      this._scheduleReconnect(url);
    }
  }

  _scheduleReconnect(url) {
    if (this._retryTimer) return;
    this._retryTimer = setTimeout(() => {
      this._retryTimer = null;
      this._connectInternal(url);
    }, 2500);
  }

  _routeMessage(msg) {
    // Expected shapes:
    // {type:"notification", payload:{...}}
    // {type:"chat_message", roomId:"event:123", payload:{...}}
    const type = msg.type || msg.event;
    if (type === "notification") {
      this.handlers?.onNotification?.(msg.payload || msg.data || msg);
    } else if (type === "chat_message") {
      const roomId = msg.roomId || msg.room_id || msg.channel || "default";
      const payload = msg.payload || msg.data || msg;
      this.handlers?.onChatMessage?.(roomId, payload);
    }
  }

  // PUBLIC_INTERFACE
  sendChatMessage(roomId, body) {
    /** Send a chat message via websocket if connected. */
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ type: "chat_message", roomId, body }));
  }
}

export const wsManager = new WsManager();
