const { Schema, default: mongoose } = require("mongoose");

const shipmentSchema = new Schema({
    shipmentID: { type: String, required: true, unique: true },
    containerID: { type: String, required: true },
    route: [{
        location: { 
            type: String,
            required: true 
        },
        coordinates: { 
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }],
    currentLocation: { type: String, required: true },
    currentETA: { type: Date, required: true },
    status: { type: String, enum: ['In Transit', 'Delivered', 'Delayed'], default: 'In Transit' }
}, 
{ timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);