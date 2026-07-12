import Layout from "../components/layout/Layout";
import DriverSearch from "../components/drivers/DriverSearch";
import AddDriverButton from "../components/drivers/AddDriverButton";
import DriverTable from "../components/drivers/DriverTable";

export default function Drivers() {
  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Drivers</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <DriverSearch />
          <AddDriverButton />
        </div>

        <DriverTable />
      </div>
    </Layout>
  );
}