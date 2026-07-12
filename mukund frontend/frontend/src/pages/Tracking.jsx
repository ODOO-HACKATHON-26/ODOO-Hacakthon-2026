import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const initialVehicles = [
  {
    id: "TRK-101",
    driver: "Rajesh",
    position: [28.6139, 77.2090],
    speed: 62,
    status: "Online",
  },
  {
    id: "TRK-102",
    driver: "Amit",
    position: [19.0760, 72.8777],
    speed: 54,
    status: "Online",
  },
  {
    id: "TRK-103",
    driver: "Priya",
    position: [12.9716, 77.5946],
    speed: 71,
    status: "Online",
  },
];

export default function Tracking() {
  const [vehicles, setVehicles] = useState(initialVehicles);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          position: [
            v.position[0] + (Math.random() - 0.5) * 0.01,
            v.position[1] + (Math.random() - 0.5) * 0.01,
          ],
          speed: Math.max(
            20,
            Math.min(90, v.speed + Math.floor(Math.random() * 11 - 5))
          ),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>
        📍 Live Fleet Tracking
      </h1>

      <MapContainer
        center={[22.5, 79]}
        zoom={5}
        style={{
          height: "650px",
          borderRadius: "18px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((vehicle) => (
          <React.Fragment key={vehicle.id}>
            <Marker position={vehicle.position}>
              <Popup>
                <b>{vehicle.id}</b>

                <br />

                Driver: {vehicle.driver}

                <br />

                Speed: {vehicle.speed} km/h

                <br />

                Status: {vehicle.status}
              </Popup>
            </Marker>

            <Polyline
              positions={[
                [
                  vehicle.position[0] - 0.02,
                  vehicle.position[1] - 0.02,
                ],
                vehicle.position,
              ]}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}