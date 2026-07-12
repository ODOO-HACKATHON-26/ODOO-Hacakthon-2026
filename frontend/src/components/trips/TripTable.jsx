import StatusBadge from "../common/StatusBadge";

export default function TripTable() {
  const trips = [
    {
      id: 1,
      vehicle: "Truck A",
      driver: "Rahul Sharma",
      route: "Delhi → Mumbai",
      status: "In Transit",
      departure: "10:30 AM",
    },
    {
      id: 2,
      vehicle: "Truck B",
      driver: "Priya Singh",
      route: "Pune → Chennai",
      status: "Scheduled",
      departure: "02:00 PM",
    },
    {
      id: 3,
      vehicle: "Truck C",
      driver: "Amit Kumar",
      route: "Jaipur → Surat",
      status: "Completed",
      departure: "Yesterday",
    },
  ];

  return (
    <div
      style={{
        background: "#1f2937",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Vehicle</th>
            <th align="left">Driver</th>
            <th align="left">Route</th>
            <th align="left">Status</th>
            <th align="left">Departure</th>
          </tr>
        </thead>

        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.vehicle}</td>
              <td>{trip.driver}</td>
              <td>{trip.route}</td>
              <td>
  <StatusBadge status={trip.status} />
             </td>
              <td>{trip.departure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}