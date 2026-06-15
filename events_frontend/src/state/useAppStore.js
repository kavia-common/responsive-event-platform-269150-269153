import { create } from "zustand";
import { api } from "../utils/apiClient.js";
import { wsManager } from "../utils/wsClient.js";
import { makeStubData } from "../utils/stubs.js";

/**
 * Note: This store is designed to gracefully degrade when backend endpoints are unavailable
 * (e.g., during early integration). It uses stub data and no-op fallbacks to keep UI functional.
 */
export const useAppStore = create((set, get) => ({
  ui: {
    sidebarOpen: true,
    chatOpen: false
  },

  session: {
    user: { id: "me", email: "me@example.com", displayName: "Me", bio: "" }
  },

  discovery: {
    filters: {
      query: "",
      category: "all",
      fromDate: "",
      toDate: "",
      maxDistanceKm: 25
    },
    events: [],
    loading: false,
    selectedEventId: null
  },

  rsvp: {
    byEventId: {}
  },

  comments: {
    byEventId: {}
  },

  notifications: {
    items: [],
    unreadCount: 0
  },

  chat: {
    rooms: [],
    activeRoomId: null,
    messagesByRoomId: {}
  },

  social: {
    feed: []
  },

  moderation: {
    queue: []
  },

  admin: {
    stats: { users: 0, events: 0, reports: 0 }
  },

  analytics: {
    rsvps7d: 0,
    newEvents7d: 0,
    activeRooms: 0
  },

  // PUBLIC_INTERFACE
  init: async () => {
    /** Initialize store: connect WS, load initial data. */
    await get().refreshEvents();

    // Seed chat rooms from events (simple UX)
    const events = get().discovery.events;
    set({
      chat: {
        ...get().chat,
        rooms: events.slice(0, 10).map((e) => ({
          id: `event:${e.id}`,
          title: e.title,
          subtitle: "Event room"
        })),
        activeRoomId: events[0] ? `event:${events[0].id}` : null
      }
    });

    wsManager.connect({
      url: wsManager.envWsUrl(),
      onNotification: (n) => get()._onIncomingNotification(n),
      onChatMessage: (roomId, msg) => get()._onIncomingChatMessage(roomId, msg)
    });

    await get().refreshNotifications();
    await get().refreshFeed();
    await get().refreshModerationQueue();
    await get().refreshAdminStats();
    await get().refreshAnalytics();
  },

  setSidebarOpen: (open) => set({ ui: { ...get().ui, sidebarOpen: open } }),
  setChatOpen: (open) => set({ ui: { ...get().ui, chatOpen: open } }),

  setDiscoveryFilters: (partial) =>
    set({
      discovery: {
        ...get().discovery,
        filters: { ...get().discovery.filters, ...partial }
      }
    }),

  selectEvent: (eventId) => set({ discovery: { ...get().discovery, selectedEventId: eventId } }),

  refreshEvents: async () => {
    set({ discovery: { ...get().discovery, loading: true } });
    try {
      const filters = get().discovery.filters;
      const events = await api.listEvents(filters).catch(() => makeStubData().events);
      set({ discovery: { ...get().discovery, events, loading: false } });
    } catch {
      set({ discovery: { ...get().discovery, events: makeStubData().events, loading: false } });
    }
  },

  createEvent: async (payload) => {
    const created = await api.createEvent(payload).catch(() => ({ ...payload, id: crypto.randomUUID() }));
    set({ discovery: { ...get().discovery, events: [created, ...get().discovery.events] } });
  },

  updateEvent: async (eventId, payload) => {
    const updated = await api.updateEvent(eventId, payload).catch(() => ({ ...payload, id: eventId }));
    set({
      discovery: {
        ...get().discovery,
        events: get().discovery.events.map((e) => (e.id === eventId ? { ...e, ...updated } : e))
      }
    });
  },

  deleteEvent: async (eventId) => {
    await api.deleteEvent(eventId).catch(() => undefined);
    set({
      discovery: { ...get().discovery, events: get().discovery.events.filter((e) => e.id !== eventId) }
    });
  },

  setRsvp: async (eventId, status) => {
    await api.setRsvp(eventId, status).catch(() => undefined);
    const existing = get().rsvp.byEventId[eventId] || { status: "none", attendees: [] };
    const me = get().session.user;
    const attendees =
      status === "going"
        ? [{ userId: me.id, name: me.displayName || "Me" }, ...existing.attendees.filter((a) => a.userId !== me.id)]
        : existing.attendees.filter((a) => a.userId !== me.id);

    set({
      rsvp: {
        byEventId: {
          ...get().rsvp.byEventId,
          [eventId]: { status, attendees }
        }
      }
    });
  },

  loadComments: async (eventId) => {
    const comments = await api.listComments(eventId).catch(() => makeStubData().commentsByEventId[eventId] || []);
    set({ comments: { byEventId: { ...get().comments.byEventId, [eventId]: comments } } });

    // Ensure a chat room exists for the event
    const roomId = `event:${eventId}`;
    if (!get().chat.rooms.find((r) => r.id === roomId)) {
      const event = get().discovery.events.find((e) => e.id === eventId);
      set({
        chat: {
          ...get().chat,
          rooms: [
            ...get().chat.rooms,
            { id: roomId, title: event?.title || "Event", subtitle: "Event room" }
          ]
        }
      });
    }
  },

  postComment: async (eventId, body) => {
    const me = get().session.user;
    const created = await api.postComment(eventId, body).catch(() => ({
      id: crypto.randomUUID(),
      eventId,
      body,
      authorName: me.displayName || "Me",
      createdAt: new Date().toISOString()
    }));
    set({
      comments: {
        byEventId: {
          ...get().comments.byEventId,
          [eventId]: [...(get().comments.byEventId[eventId] || []), created]
        }
      }
    });
    // Also send over WS if available
    wsManager.sendChatMessage(`event:${eventId}`, created.body);
  },

  openNotifications: () => {
    // Basic behavior: route-driven UI exists; here we just mark visible
    // Consumers can navigate to /notifications.
    // Keeping as hook for bell click.
  },

  refreshNotifications: async () => {
    const items = await api.listNotifications().catch(() => makeStubData().notifications);
    const unreadCount = items.filter((n) => !n.read).length;
    set({ notifications: { items, unreadCount } });
  },

  markAllNotificationsRead: async () => {
    await api.markAllNotificationsRead().catch(() => undefined);
    const items = get().notifications.items.map((n) => ({ ...n, read: true }));
    set({ notifications: { items, unreadCount: 0 } });
  },

  refreshFeed: async () => {
    const feed = await api.getFeed().catch(() => makeStubData().feed);
    set({ social: { feed } });
  },

  followUser: async (userId) => {
    await api.followUser(userId).catch(() => undefined);
  },

  shareEvent: async (eventId) => {
    // Simple share: use Web Share API if available else copy link
    const url = `${window.location.origin}/discover?event=${encodeURIComponent(eventId)}`;
    try {
      if (navigator.share) await navigator.share({ title: "Event", url });
      else await navigator.clipboard.writeText(url);
      get()._onIncomingNotification({
        id: crypto.randomUUID(),
        title: "Shared",
        body: "Event link copied / shared.",
        read: false
      });
    } catch {
      // ignore
    }
  },

  submitReport: async ({ targetType, targetId, reason }) => {
    await api.submitReport({ targetType, targetId, reason }).catch(() => undefined);
    get()._onIncomingNotification({
      id: crypto.randomUUID(),
      title: "Report submitted",
      body: `Thanks—your report was submitted for ${targetType}:${targetId}`,
      read: false
    });
  },

  refreshModerationQueue: async () => {
    const queue = await api.listModerationQueue().catch(() => makeStubData().moderationQueue);
    set({ moderation: { queue } });
  },

  resolveReport: async (reportId, outcome) => {
    await api.resolveReport(reportId, outcome).catch(() => undefined);
    set({ moderation: { queue: get().moderation.queue.filter((r) => r.id !== reportId) } });
  },

  refreshAdminStats: async () => {
    const stats = await api.getAdminStats().catch(() => makeStubData().adminStats);
    set({ admin: { stats } });
  },

  adminBanUser: async (userId) => {
    if (!userId) return;
    await api.adminBanUser(userId).catch(() => undefined);
    get()._onIncomingNotification({
      id: crypto.randomUUID(),
      title: "Admin action",
      body: `Banned user ${userId}`,
      read: false
    });
  },

  adminDeleteEvent: async (eventId) => {
    if (!eventId) return;
    await api.adminDeleteEvent(eventId).catch(() => undefined);
    await get().deleteEvent(eventId);
  },

  refreshAnalytics: async () => {
    const analytics = await api.getAnalytics().catch(() => makeStubData().analytics);
    set({ analytics });
  },

  updateProfile: async (payload) => {
    await api.updateProfile(payload).catch(() => undefined);
    set({ session: { user: { ...get().session.user, ...payload } } });
  },

  setActiveChatRoom: (roomId) => set({ chat: { ...get().chat, activeRoomId: roomId } }),

  sendChatMessage: async (roomId, body) => {
    const me = get().session.user;
    const msg = {
      id: crypto.randomUUID(),
      authorName: me.displayName || "Me",
      body,
      createdAt: new Date().toISOString()
    };
    wsManager.sendChatMessage(roomId, body);
    get()._onIncomingChatMessage(roomId, msg);
  },

  _onIncomingNotification: (n) => {
    const items = [n, ...get().notifications.items];
    const unreadCount = items.filter((x) => !x.read).length;
    set({ notifications: { items, unreadCount } });
  },

  _onIncomingChatMessage: (roomId, msg) => {
    set({
      chat: {
        ...get().chat,
        messagesByRoomId: {
          ...get().chat.messagesByRoomId,
          [roomId]: [...(get().chat.messagesByRoomId[roomId] || []), msg]
        }
      }
    });
  }
}));
