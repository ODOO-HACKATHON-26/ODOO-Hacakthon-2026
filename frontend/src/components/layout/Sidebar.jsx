import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Drivers", path: "/drivers" },
  { name: "Trips", path: "/trips" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>🚍 TransitOps</h2>

      <hr />

      {links.map((link) => (
        <div key={link.path} style={{ margin: "18px 0" }}>
          <NavLink
            to={link.path}
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            {link.name}
          </NavLink>
        </div>
      ))}

      <hr />

      <button
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        Logout
      </button>
    </aside>
  );
}