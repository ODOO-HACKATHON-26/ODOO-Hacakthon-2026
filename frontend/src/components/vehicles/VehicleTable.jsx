export default function VehicleTable() {
  const vehicles = [
    {
      id: 1,
      vehicle: "Truck A",
      driver: "Rahul",
      status: "Active",
      route: "Delhi → Mumbai",
    },
    {
      id: 2,
      vehicle: "Truck B",
      driver: "Priya",
      status: "Maintenance",
      route: "Pune → Chennai",
    },
    {
      id: 3,
      vehicle: "Truck C",
      driver: "Amit",
      status: "Active",
      route: "Jaipur → Surat",
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
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Vehicle</th>
            <th align="left">Driver</th>
            <th align="left">Status</th>
            <th align="left">Route</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.vehicle}</td>
              <td>{vehicle.driver}</td>
              <td>{vehicle.status}</td>
              <td>{vehicle.route}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}