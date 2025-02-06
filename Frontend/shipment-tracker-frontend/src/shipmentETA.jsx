import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShipmentETA = ({ id }) => {
    const [eta, setEta] = useState(null);

    useEffect(() => {
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            console.error("Invalid shipment ID format");
            return;
        }

        const fetchETA = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/shipment/${id}/eta`
                );
                setEta(response.data.eta);
            } catch (error) {
                console.error('Error fetching ETA:', error);
            }
        };

        fetchETA();
    }, [id]);


    return (
        <div>
            <h3>Estimated Time of Arrival</h3>
            {eta ? (
                <p>ETA: {new Date(eta).toLocaleString()}</p>
            ) : (
                <p>Loading ETA...</p>
            )}
        </div>
    );
};

export default ShipmentETA;