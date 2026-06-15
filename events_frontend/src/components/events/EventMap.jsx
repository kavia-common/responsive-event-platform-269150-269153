import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function EventMap({ events, selectedId, onSelect }) {
  const center = React.useMemo(() => {
    const withGeo = events.find((e) => e.lat != null && e.lng != null);
    return withGeo ? [withGeo.lat, withGeo.lng] : [37.7749, -122.4194];
  }, [events]);

  return (
    <div className="mapWrap">
      <MapContainer center={center} zoom={12} className="map">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {events
          .filter((e) => e.lat != null && e.lng != null)
          .map((e) => (
            <Marker
              key={e.id}
              position={[e.lat, e.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelect(e.id)
              }}
            >
              <Popup>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{e.locationName}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {new Date(e.startAt).toLocaleString()} {selectedId === e.id ? " · Selected" : ""}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
