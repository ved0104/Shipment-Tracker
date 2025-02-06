const Shipment = require('../models/shipment')
const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY
const axios = require('axios')
const getCoordinates = async (city) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${GEOCODING_API_KEY}`);
        const { lat, lng } = response.data.results[0].geometry;
        console.log([lat,lng])
        return [lat, lng]; 
    } catch (error) {
        console.error(`Error fetching coordinates for ${city}:`, error);
        return null;
    }
};
// Get: All Shipments
exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find()
        res.json(shipments);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Get: single shipment
exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) {
            return res.status(400).json({ message: 'Shipment not found' });
        }

        if (shipment.route && Array.isArray(shipment.route)) {
            const updatedRoute = await Promise.all(
                shipment.route.map(async (routeItem) => {
                    if (!routeItem.coordinates) {
                        const coordinates = await getCoordinates(routeItem.location);
                        if (coordinates) {
                            routeItem.coordinates = coordinates;
                        }
                    }
                    return routeItem; 
                })
            );
            shipment.route = updatedRoute;
        }

        console.log("Updated Shipment Route:", shipment.route);
        res.json(shipment);
    } catch (err) {
        console.error('Error fetching shipment:', err);
        res.status(500).json({ error: err.message });
    }
};



// Post: Create Shipment
exports.createShipment = async (req, res) => {
    try {
        const { shipmentID, containerID, route, currentLocation, currentETA, status } = req.body;
        console.log('Received data:', req.body);

        if (!Array.isArray(route)) {
            return res.status(400).json({ message: 'route should be an array' });
        }

        const routeWithCoordinates = [];

        for (let routeItem of route) {
            const coordinates = await getCoordinates(routeItem.location);
            if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
                const [lat, lng] = coordinates;
                routeWithCoordinates.push({
                    location: routeItem.location,
                    coordinates: { lat, lng },
                    timestamp: routeItem.timestamp || Date.now()
                });
            } else {
                return res.status(400).json({ message: `Coordinates not found or invalid for location: ${routeItem.location}` });
            }
        }

        const newShipment = new Shipment({
            shipmentID,
            containerID,
            route: routeWithCoordinates,
            currentLocation,
            currentETA,
            status
        });

        await newShipment.save();
        res.status(201).json(newShipment);
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get: Update Location
exports.updateShipmentLocation = async (req, res) => {
    try {
        const { currentLocation } = req.body;  // Extract currentLocation from body
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, { currentLocation }, { new: true });
        if (!shipment) return res.status(400).json({ message: 'Shipment not found' });
        res.json(shipment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get: ETA of Shipment
exports.getShipmentETA = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Ensure currentLocation and route are present
        const currentLocation = shipment.currentLocation;
        if (!currentLocation || !currentLocation.coordinates) {
            return res.status(400).json({ message: 'Current location data is missing' });
        }

        const route = shipment.route;
        if (!route || route.length === 0 || !route[route.length - 1].coordinates) {
            return res.status(400).json({ message: 'Route data is missing or incomplete' });
        }

        const currentCoord = currentLocation.coordinates;
        const destinationCoord = route[route.length - 1].coordinates;

        // Ensure coordinates are valid
        if (
            typeof currentCoord.lat !== 'number' || typeof currentCoord.lng !== 'number' ||
            typeof destinationCoord.lat !== 'number' || typeof destinationCoord.lng !== 'number'
        ) {
            return res.status(400).json({ message: 'Invalid coordinates data' });
        }

        // Calculate the distance between current location and destination
        const distance = calculateDistance(
            currentCoord.lat, currentCoord.lng, destinationCoord.lat, destinationCoord.lng
        );

        // Example of calculating ETA based on distance and speed (e.g., 50 km/h)
        const speed = 50; // km/h
        const timeInHours = distance / speed; // ETA in hours
        const eta = new Date();
        eta.setHours(eta.getHours() + timeInHours); // Estimate ETA based on current time

        // Return ETA as ISO string
        res.json({ eta: eta.toISOString() });

    } catch (err) {
        console.error('Error fetching ETA:', err); // Log the error to server logs
        res.status(500).json({ error: err.message });
    }
};

// Haversine formula to calculate distance between two coordinates (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}
