import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginTop: "24px",
      }}
    >
      <StatCard title="Total Vehicles" value="24" />
      <StatCard title="Active Drivers" value="18" />
      <StatCard title="Trips Today" value="42" />
      <StatCard title="Revenue" value="₹18,500" />
    </div>
  );
}