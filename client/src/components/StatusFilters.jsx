export default function StatusFilters({ filters, value, onChange }) {
  return (
    <div className="filters" role="tablist" aria-label="Filter applications">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          role="tab"
          aria-selected={value === filter.id}
          className={`filter${value === filter.id ? " active" : ""}${
            filter.id === "Needs Follow-Up" ? " follow-up-filter" : ""
          }`}
          onClick={() => onChange(filter.id)}
        >
          {filter.label}
          <span>{filter.count}</span>
        </button>
      ))}
    </div>
  );
}
