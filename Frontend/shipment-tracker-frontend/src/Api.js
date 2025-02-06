import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api' 
});

API.interceptors.request.use((req) => {
    return req;
});

export const getShipments = () => API.get('/shipments');
export const addShipment = (shipmentData) => API.post('/shipment', shipmentData);
export const deleteShipment = (id) => API.delete(`/shipments/${id}`); 