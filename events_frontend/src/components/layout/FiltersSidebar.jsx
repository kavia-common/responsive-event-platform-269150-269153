import React from "react";
import { useAppStore } from "../../state/useAppStore.js";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "tech", label: "Tech" },
  { value: "food", label: "Food" },
  { value: "community", label: "Community" }
];

export default function FiltersSidebar() {
  const filters = useAppStore((s) => s.discovery.filters);
  const setFilters = useAppStore((s) => s.setDiscoveryFilters);
  const refresh = useAppStore((s) => s.refreshEvents);

  return (
    <div className="filters">
      <h2 className="filtersTitle">Filters</h2>

      <Input
        label="Search"
        value={filters.query}
        onChange={(v) => setFilters({ query: v })}
        placeholder="Name, location, tag…"
      />

      <Select
        label="Category"
        value={filters.category}
        options={CATEGORY_OPTIONS}
        onChange={(v) => setFilters({ category: v })}
      />

      <Input
        label="From date"
        type="date"
        value={filters.fromDate}
        onChange={(v) => setFilters({ fromDate: v })}
      />
      <Input label="To date" type="date" value={filters.toDate} onChange={(v) => setFilters({ toDate: v })} />

      <Input
        label="Max distance (km)"
        type="number"
        value={String(filters.maxDistanceKm)}
        onChange={(v) => setFilters({ maxDistanceKm: Number(v || 0) })}
        placeholder="e.g. 10"
      />

      <div className="filtersActions">
        <Button variant="secondary" onClick={refresh}>
          Apply
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({
              query: "",
              category: "all",
              fromDate: "",
              toDate: "",
              maxDistanceKm: 25
            })
          }
        >
          Reset
        </Button>
      </div>

      <p className="filtersHint">
        This UI is wired to a backend-agnostic API client. Configure <code>REACT_APP_API_BASE</code> /{" "}
        <code>REACT_APP_WS_URL</code> in <code>.env</code>.
      </p>
    </div>
  );
}
