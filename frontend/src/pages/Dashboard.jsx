import Layout from "../components/layout/Layout";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentTrips from "../components/dashboard/RecentTrips";

export default function Dashboard() {
  return (
    <Layout>
      <div
        style={{
          padding: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Dashboard</h1>

        <DashboardStats />

        <RecentTrips />
      </div>
    </Layout>
  );
}
