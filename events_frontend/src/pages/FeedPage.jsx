import React from "react";
import { useAppStore } from "../state/useAppStore.js";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

export default function FeedPage() {
  const feed = useAppStore((s) => s.social.feed);
  const refresh = useAppStore((s) => s.refreshFeed);
  const follow = useAppStore((s) => s.followUser);
  const share = useAppStore((s) => s.shareEvent);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="page">
      <div className="pageHeader">
        <h1>Feed</h1>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </div>

      <div className="stack">
        {feed.map((item) => (
          <Card key={item.id}>
            <div className="feedRow">
              <div>
                <div className="feedTitle">{item.title}</div>
                <div className="muted">{item.subtitle}</div>
              </div>
              <div className="feedActions">
                <Button variant="ghost" onClick={() => follow(item.actorUserId)}>
                  Follow
                </Button>
                <Button variant="ghost" onClick={() => share(item.eventId)}>
                  Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {feed.length === 0 ? <div className="muted">No feed items yet.</div> : null}
      </div>
    </div>
  );
}
