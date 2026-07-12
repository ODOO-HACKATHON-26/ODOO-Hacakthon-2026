import Layout from "../components/layout/Layout";
import TripSearch from "../components/trips/TripSearch";
import AddTripButton from "../components/trips/AddTripButton";
import TripTable from "../components/trips/TripTable";

export default function Trips() {
  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Trips</h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <TripSearch />
          <AddTripButton />
        </div>

        <TripTable />
      </div>
    </Layout>
  );
}