export default function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}