import StatusBadge from "../common/StatusBadge";

export default function DriverTable() {
  const drivers = [
    {
      id: 1,
      name: "Rahul Sharma",
      vehicle: "Truck A",
      status: "On Duty",
      phone: "+91 9876543210",
    },
    {
      id: 2,
      name: "Priya Singh",
      vehicle: "Truck B",
      status: "Off Duty",
      phone: "+91 9123456789",
    },
    {
      id: 3,
      name: "Amit Kumar",
      vehicle: "Truck C",
      status: "On Duty",
      phone: "+91 9988776655",
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
            <th align="left">Driver</th>
            <th align="left">Vehicle</th>
            <th align="left">Status</th>
            <th align="left">Phone</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.vehicle}</td>
              <td>
  <StatusBadge status={driver.status} />
             </td>
              <td>{driver.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}