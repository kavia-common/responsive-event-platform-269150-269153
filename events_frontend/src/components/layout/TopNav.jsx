import React from "react";
import { NavLink } from "react-router-dom";
import { useAppStore } from "../../state/useAppStore.js";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import CreateEditEventForm from "../events/CreateEditEventForm.jsx";
import ProfileForm from "../profile/ProfileForm.jsx";

export default function TopNav({ onToggleSidebar, onToggleChat }) {
  const unread = useAppStore((s) => s.notifications.unreadCount);
  const openNotifications = useAppStore((s) => s.openNotifications);
  const me = useAppStore((s) => s.session.user);

  const [eventModalOpen, setEventModalOpen] = React.useState(false);
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  return (
    <header className="topNav">
      <div className="topNavLeft">
        <Button variant="ghost" onClick={onToggleSidebar} ariaLabel="Toggle filters">
          ☰
        </Button>
        <div className="brand">Events</div>
        <nav className="navLinks" aria-label="Primary">
          <NavLink to="/discover" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Discover
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Feed
          </NavLink>
          <NavLink
            to="/moderation"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            Moderation
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Admin
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
          >
            Analytics
          </NavLink>
        </nav>
      </div>

      <div className="topNavRight">
        <Button variant="primary" onClick={() => setEventModalOpen(true)} ariaLabel="Create event">
          + Create
        </Button>

        <button
          className="iconButton"
          onClick={openNotifications}
          title="Notifications"
          aria-label="Notifications"
        >
          🔔
          {unread > 0 ? <span className="badge">{unread}</span> : null}
        </button>

        <button className="iconButton" onClick={onToggleChat} title="Chat" aria-label="Chat drawer">
          💬
        </button>

        <button
          className="avatarButton"
          onClick={() => setProfileModalOpen(true)}
          aria-label="Edit profile"
          title="Profile"
        >
          <span className="avatarCircle">{(me?.displayName || me?.email || "U").slice(0, 1).toUpperCase()}</span>
        </button>
      </div>

      <Modal open={eventModalOpen} onClose={() => setEventModalOpen(false)} title="Create event">
        <CreateEditEventForm mode="create" onDone={() => setEventModalOpen(false)} />
      </Modal>

      <Modal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} title="Edit profile">
        <ProfileForm onDone={() => setProfileModalOpen(false)} />
      </Modal>
    </header>
  );
}
