import { addHours } from "date-fns";

export function makeStubData() {
  const now = new Date();
  const events = [
    {
      id: "e1",
      title: "Sunset Park Yoga",
      description: "Bring a mat. Beginner friendly.",
      category: "community",
      locationName: "Golden Gate Park",
      lat: 37.7694,
      lng: -122.4862,
      startAt: addHours(now, 6).toISOString(),
      distanceKm: 4
    },
    {
      id: "e2",
      title: "Indie Music Night",
      description: "Live sets and open mic.",
      category: "music",
      locationName: "Mission District",
      lat: 37.7599,
      lng: -122.4148,
      startAt: addHours(now, 10).toISOString(),
      distanceKm: 2
    },
    {
      id: "e3",
      title: "Tech Meetup: WebSockets",
      description: "Real-time apps in practice.",
      category: "tech",
      locationName: "SoMa",
      lat: 37.7786,
      lng: -122.4056,
      startAt: addHours(now, 18).toISOString(),
      distanceKm: 6
    }
  ];

  const commentsByEventId = {
    e1: [
      { id: "c1", eventId: "e1", body: "I’m in!", authorName: "Ava", createdAt: addHours(now, -1).toISOString() }
    ],
    e2: [],
    e3: []
  };

  const notifications = [
    { id: "n1", title: "Welcome", body: "Discover events near you.", read: false, createdAt: now.toISOString() }
  ];

  const feed = [
    { id: "f1", title: "Ava RSVP’d", subtitle: "Sunset Park Yoga", actorUserId: "u_ava", eventId: "e1" }
  ];

  const moderationQueue = [{ id: "r1", targetType: "comment", targetId: "c1", reason: "Spam suspected" }];

  const adminStats = { users: 128, events: 42, reports: 3 };

  const analytics = { rsvps7d: 340, newEvents7d: 12, activeRooms: 8 };

  return { events, commentsByEventId, notifications, feed, moderationQueue, adminStats, analytics };
}
