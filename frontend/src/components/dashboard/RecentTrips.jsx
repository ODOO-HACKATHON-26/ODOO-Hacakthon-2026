export default function RecentTrips() {
  const trips = [
    {
      vehicle: "Truck A",
      route: "Delhi → Mumbai",
    },
    {
      vehicle: "Truck B",
      route: "Pune → Chennai",
    },
    {
      vehicle: "Truck C",
      route: "Jaipur → Surat",
    },
  ];

  return (
    <div
      style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "24px",
      }}
    >
      <h2>Recent Trips</h2>

      {trips.map((trip, index) => (
        <div
          key={index}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #374151",
          }}
        >
          <strong>{trip.vehicle}</strong>

          <p>{trip.route}</p>
        </div>
      ))}
    </div>
  );
}