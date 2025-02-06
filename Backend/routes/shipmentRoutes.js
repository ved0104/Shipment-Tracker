const express=require('express')
const router=express.Router();
const shipmentController=require('../controllers/shipmentController')
require('dotenv').config();

router.get("/shipments",shipmentController.getAllShipments)
router.get("/shipment/:id",shipmentController.getShipmentById)
router.post("/shipment",shipmentController.createShipment)
router.patch("/shipment/:id/update-location",shipmentController.updateShipmentLocation)
router.get("/shipment/:id/eta",shipmentController.getShipmentETA)
router.delete('/shipments/:id', async (req, res) => {
    try {
      const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
      if (!deletedShipment) {
        return res.status(404).json({ message: 'Shipment not found' });
      }
      res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
