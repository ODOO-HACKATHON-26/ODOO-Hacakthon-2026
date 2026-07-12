export default function StatusBadge({ status }) {
  const styles = {
    Active: {
      background: "#16a34a",
      color: "white",
    },
    Maintenance: {
      background: "#eab308",
      color: "#111",
    },
    "On Duty": {
      background: "#16a34a",
      color: "white",
    },
    "Off Duty": {
      background: "#ef4444",
      color: "white",
    },
    "In Transit": {
      background: "#2563eb",
      color: "white",
    },
    Scheduled: {
      background: "#9333ea",
      color: "white",
    },
    Completed: {
      background: "#6b7280",
      color: "white",
    },
  };

  return (
    <span
      style={{
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "600",
        display: "inline-block",
        minWidth: "90px",
        textAlign: "center",
        ...styles[status],
      }}
    >
      {status}
    </span>
  );
}