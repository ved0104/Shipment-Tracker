import axios from 'axios'
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
})

export const getShipments=()=>API.get('/shipments')
export const addShipment = (shipmentData) => API.post('/shipment', shipmentData);
export const deleteShipment = (id) => {
    return axios.delete(`/api/shipments/${id}`);
  };