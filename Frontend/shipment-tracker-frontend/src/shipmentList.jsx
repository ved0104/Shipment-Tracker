import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/shipments");
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      }
    };

    fetchShipments();
  }, []);

  return (
    <div>
      <h1>Shipments</h1>
      <ul>
        {shipments.map((shipment) => (
          <li key={shipment._id}>
            <Link to={`/shipment/${shipment._id}`}>
              {shipment.shipmentID} - {shipment.currentLocation} ➝ {shipment.route[shipment.route.length - 1]?.location || "Destination Unknown"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentList;
