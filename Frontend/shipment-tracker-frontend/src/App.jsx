import React from 'react';
import "./App.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import ShipmentForm from './Form';
import ShipmentDetails from './shipmentDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shipment-form" element={<ShipmentForm />} />
        <Route path="/shipment/:id" element={<ShipmentDetails/>} />
      </Routes>
    </Router>
  );
}
