const API_BASE =
  import.meta.env.VITE_API_BASE ||
  window.__API_BASE__ ||
  // fallback to CRA-style env if present (since .env is CRA-ish)
  (typeof process !== "undefined" ? process.env?.REACT_APP_API_BASE : undefined) ||
  "http://localhost:3001";

/**
 * This client intentionally uses conservative endpoint guesses and falls back without throwing
 * so the UI remains usable even before backend endpoint names stabilize.
 */
async function http(path, { method = "GET", body, headers } = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include"
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status} for ${path}: ${text}`);
    err.status = res.status;
    throw err;
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export const api = {
  // PUBLIC_INTERFACE
  listEvents: async (filters) => {
    /** List events for discovery. */
    const qs = new URLSearchParams();
    if (filters?.query) qs.set("q", filters.query);
    if (filters?.category && filters.category !== "all") qs.set("category", filters.category);
    if (filters?.fromDate) qs.set("from", filters.fromDate);
    if (filters?.toDate) qs.set("to", filters.toDate);
    if (filters?.maxDistanceKm != null) qs.set("max_distance_km", String(filters.maxDistanceKm));

    // Common patterns: /events, /api/events, /v1/events
    const candidates = [`/events?${qs.toString()}`, `/api/events?${qs.toString()}`, `/v1/events?${qs.toString()}`];
    for (const c of candidates) {
      try {
        const data = await http(c);
        // normalize
        const items = Array.isArray(data) ? data : data?.items || data?.events || [];
        return items.map(normalizeEvent);
      } catch {
        // continue
      }
    }
    throw new Error("listEvents: no working endpoint");
  },

  createEvent: async (payload) => {
    const candidates = ["/events", "/api/events", "/v1/events"];
    for (const c of candidates) {
      try {
        const data = await http(c, { method: "POST", body: payload });
        return normalizeEvent(data?.event || data);
      } catch {
        // continue
      }
    }
    throw new Error("createEvent: no working endpoint");
  },

  updateEvent: async (eventId, payload) => {
    const candidates = [`/events/${eventId}`, `/api/events/${eventId}`, `/v1/events/${eventId}`];
    for (const c of candidates) {
      try {
        const data = await http(c, { method: "PUT", body: payload });
        return normalizeEvent(data?.event || data);
      } catch {
        // continue
      }
    }
    throw new Error("updateEvent: no working endpoint");
  },

  deleteEvent: async (eventId) => {
    const candidates = [`/events/${eventId}`, `/api/events/${eventId}`, `/v1/events/${eventId}`];
    for (const c of candidates) {
      try {
        await http(c, { method: "DELETE" });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("deleteEvent: no working endpoint");
  },

  setRsvp: async (eventId, status) => {
    const candidates = [
      `/events/${eventId}/rsvp`,
      `/api/events/${eventId}/rsvp`,
      `/v1/events/${eventId}/rsvp`,
      `/rsvp`
    ];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST", body: { eventId, status } });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("setRsvp: no working endpoint");
  },

  listComments: async (eventId) => {
    const candidates = [
      `/events/${eventId}/comments`,
      `/api/events/${eventId}/comments`,
      `/v1/events/${eventId}/comments`
    ];
    for (const c of candidates) {
      try {
        const data = await http(c);
        const items = Array.isArray(data) ? data : data?.items || data?.comments || [];
        return items.map(normalizeComment);
      } catch {
        // continue
      }
    }
    throw new Error("listComments: no working endpoint");
  },

  postComment: async (eventId, body) => {
    const candidates = [
      `/events/${eventId}/comments`,
      `/api/events/${eventId}/comments`,
      `/v1/events/${eventId}/comments`
    ];
    for (const c of candidates) {
      try {
        const data = await http(c, { method: "POST", body: { body } });
        return normalizeComment(data?.comment || data);
      } catch {
        // continue
      }
    }
    throw new Error("postComment: no working endpoint");
  },

  listNotifications: async () => {
    const candidates = ["/notifications", "/api/notifications", "/v1/notifications"];
    for (const c of candidates) {
      try {
        const data = await http(c);
        const items = Array.isArray(data) ? data : data?.items || data?.notifications || [];
        return items.map(normalizeNotification);
      } catch {
        // continue
      }
    }
    throw new Error("listNotifications: no working endpoint");
  },

  markAllNotificationsRead: async () => {
    const candidates = ["/notifications/read-all", "/api/notifications/read-all", "/v1/notifications/read-all"];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST" });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("markAllNotificationsRead: no working endpoint");
  },

  getFeed: async () => {
    const candidates = ["/feed", "/api/feed", "/v1/feed"];
    for (const c of candidates) {
      try {
        const data = await http(c);
        const items = Array.isArray(data) ? data : data?.items || data?.feed || [];
        return items.map(normalizeFeedItem);
      } catch {
        // continue
      }
    }
    throw new Error("getFeed: no working endpoint");
  },

  followUser: async (userId) => {
    const candidates = [`/users/${userId}/follow`, `/api/users/${userId}/follow`, `/v1/users/${userId}/follow`];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST" });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("followUser: no working endpoint");
  },

  submitReport: async ({ targetType, targetId, reason }) => {
    const candidates = ["/reports", "/api/reports", "/v1/reports"];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST", body: { targetType, targetId, reason } });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("submitReport: no working endpoint");
  },

  listModerationQueue: async () => {
    const candidates = ["/moderation/reports", "/api/moderation/reports", "/v1/moderation/reports"];
    for (const c of candidates) {
      try {
        const data = await http(c);
        const items = Array.isArray(data) ? data : data?.items || data?.reports || [];
        return items.map((r) => ({
          id: String(r.id || r._id || crypto.randomUUID()),
          targetType: r.targetType || r.target_type || "event",
          targetId: String(r.targetId || r.target_id || ""),
          reason: r.reason || ""
        }));
      } catch {
        // continue
      }
    }
    throw new Error("listModerationQueue: no working endpoint");
  },

  resolveReport: async (reportId, outcome) => {
    const candidates = [
      `/moderation/reports/${reportId}/resolve`,
      `/api/moderation/reports/${reportId}/resolve`,
      `/v1/moderation/reports/${reportId}/resolve`
    ];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST", body: { outcome } });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("resolveReport: no working endpoint");
  },

  getAdminStats: async () => {
    const candidates = ["/admin/stats", "/api/admin/stats", "/v1/admin/stats"];
    for (const c of candidates) {
      try {
        const data = await http(c);
        return {
          users: Number(data.users || data.userCount || 0),
          events: Number(data.events || data.eventCount || 0),
          reports: Number(data.reports || data.reportCount || 0)
        };
      } catch {
        // continue
      }
    }
    throw new Error("getAdminStats: no working endpoint");
  },

  adminBanUser: async (userId) => {
    const candidates = [`/admin/users/${userId}/ban`, `/api/admin/users/${userId}/ban`, `/v1/admin/users/${userId}/ban`];
    for (const c of candidates) {
      try {
        await http(c, { method: "POST" });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("adminBanUser: no working endpoint");
  },

  adminDeleteEvent: async (eventId) => {
    const candidates = [
      `/admin/events/${eventId}`,
      `/api/admin/events/${eventId}`,
      `/v1/admin/events/${eventId}`
    ];
    for (const c of candidates) {
      try {
        await http(c, { method: "DELETE" });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("adminDeleteEvent: no working endpoint");
  },

  getAnalytics: async () => {
    const candidates = ["/analytics", "/api/analytics", "/v1/analytics"];
    for (const c of candidates) {
      try {
        const data = await http(c);
        return {
          rsvps7d: Number(data.rsvps7d || data.rsvps_7d || 0),
          newEvents7d: Number(data.newEvents7d || data.new_events_7d || 0),
          activeRooms: Number(data.activeRooms || data.active_rooms || 0)
        };
      } catch {
        // continue
      }
    }
    throw new Error("getAnalytics: no working endpoint");
  },

  updateProfile: async (payload) => {
    const candidates = ["/me", "/api/me", "/v1/me", "/profile", "/api/profile"];
    for (const c of candidates) {
      try {
        await http(c, { method: "PUT", body: payload });
        return;
      } catch {
        // continue
      }
    }
    throw new Error("updateProfile: no working endpoint");
  }
};

function normalizeEvent(e) {
  const id = String(e.id || e._id || crypto.randomUUID());
  return {
    id,
    title: e.title || e.name || "Untitled event",
    description: e.description || "",
    category: e.category || "community",
    locationName: e.locationName || e.location_name || e.location || "Unknown",
    lat: e.lat ?? e.latitude ?? null,
    lng: e.lng ?? e.longitude ?? null,
    startAt: e.startAt || e.start_at || e.startTime || new Date().toISOString(),
    imageUrl: e.imageUrl || e.image_url || "",
    distanceKm: e.distanceKm ?? e.distance_km ?? null
  };
}

function normalizeComment(c) {
  return {
    id: String(c.id || c._id || crypto.randomUUID()),
    eventId: String(c.eventId || c.event_id || ""),
    body: c.body || c.text || "",
    authorName: c.authorName || c.author_name || c.userName || "User",
    createdAt: c.createdAt || c.created_at || new Date().toISOString()
  };
}

function normalizeNotification(n) {
  return {
    id: String(n.id || n._id || crypto.randomUUID()),
    title: n.title || n.type || "Notification",
    body: n.body || n.message || "",
    read: Boolean(n.read),
    createdAt: n.createdAt || n.created_at || new Date().toISOString()
  };
}

function normalizeFeedItem(i) {
  return {
    id: String(i.id || i._id || crypto.randomUUID()),
    title: i.title || "Activity",
    subtitle: i.subtitle || i.body || "",
    actorUserId: String(i.actorUserId || i.actor_user_id || i.userId || ""),
    eventId: String(i.eventId || i.event_id || "")
  };
}
