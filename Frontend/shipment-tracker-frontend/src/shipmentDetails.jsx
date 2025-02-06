import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [eta, setEta] = useState(null);  // State for ETA

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shipment/${id}`
        );
        setShipment(response.data);
      } catch (error) {
        console.error("Error fetching shipment details:", error);
      }
    };

    fetchShipment();
  }, [id]);

  useEffect(() => {
    if (shipment) {
      const fetchETA = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/shipment/${id}/eta`
          );
          setEta(response.data.eta);
        } catch (error) {
          console.error("Error fetching ETA:", error);
        }
      };

      fetchETA();
    }
  }, [shipment, id]);

  if (!shipment) {
    return <p>Loading shipment details...</p>;
  }

  const routeCoordinates = shipment.route
    .map((point) =>
      point.coordinates && point.coordinates.lat && point.coordinates.lng
        ? [point.coordinates.lat, point.coordinates.lng]
        : null
    )
    .filter((coord) => coord !== null);

  const startPoint = routeCoordinates[0] || [51.505, -0.09];
  const endPoint = routeCoordinates[routeCoordinates.length - 1] || startPoint;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        &larr; Back to Shipments
      </button>

      <h1 style={{ marginBottom: "30px" }}>Shipment Details: {shipment.shipmentID}</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2>Basic Information</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={detailCardStyle}>
            <h3>Container ID</h3>
            <p>{shipment.containerID}</p>
          </div>

          <div style={detailCardStyle}>
            <h3>Current Location</h3>
            <p>{shipment.currentLocation}</p>
          </div>

          <div style={detailCardStyle}>
            <h3>Status</h3>
            <p
              style={{
                color: shipment.status === "Delayed" ? "red" : "inherit",
                fontWeight: "bold",
              }}
            >
              {shipment.status}
            </p>
          </div>

          <div style={detailCardStyle}>
            <h3>Estimated Time of Arrival</h3>
            <p>{eta ? new Date(eta).toLocaleString() : "Loading ETA..."}</p>
          </div>
        </div>

        <h2 style={{ marginBottom: "20px" }}>Route Details</h2>
        <div style={{ display: "grid", gap: "15px", marginBottom: "40px" }}>
          {shipment.route.map((point, index) => (
            <div key={index} style={routeCardStyle}>
              <h3>
                Stop #{index + 1}: {point.location}
              </h3>
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <strong>Coordinates:</strong>
                  <br />
                  Lat: {point.coordinates.lat.toFixed(4)}
                  <br />
                  Lng: {point.coordinates.lng.toFixed(4)}
                </div>
                <div>
                  <strong>Timestamp:</strong>
                  <br />
                  {new Date(point.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ marginBottom: "20px" }}>Route Visualization</h2>
      <div style={{ borderRadius: "10px", overflow: "hidden" }}>
        <MapContainer
          center={startPoint}
          zoom={5}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <Marker position={startPoint}>
            <Popup>Start Point: {shipment.route[0].location}</Popup>
          </Marker>

          {routeCoordinates.length > 1 && (
            <>
              <Marker position={endPoint}>
                <Popup>End Point: {shipment.route[shipment.route.length - 1].location}</Popup>
              </Marker>
              <Polyline positions={routeCoordinates} color="blue" weight={3} opacity={0.7} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

// Style variables
const detailCardStyle = {
  background: "#f5f5f5",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const routeCardStyle = {
  background: "#fff",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  borderLeft: "4px solid #2196f3",
};

export default ShipmentDetails;
