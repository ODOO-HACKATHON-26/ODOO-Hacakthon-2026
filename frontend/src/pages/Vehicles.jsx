import Layout from "../components/layout/Layout";
import VehicleSearch from "../components/vehicles/VehicleSearch";
import AddVehicleButton from "../components/vehicles/AddVehicleButton";
import VehicleTable from "../components/vehicles/VehicleTable";

export default function Vehicles() {
  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Vehicles</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <VehicleSearch />

          <AddVehicleButton />
        </div>

        <VehicleTable />
      </div>
    </Layout>
  );
}