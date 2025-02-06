import { useState } from "react";
import { addShipment } from "./Api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Paper,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

export default function ShipmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shipmentID: "",
    containerID: "",
    route: [{ location: "", timestamp: new Date() }],
    currentLocation: "",
    currentETA: "",
    status: "In Transit",
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "location") {
      const updatedRoute = [...formData.route];
      updatedRoute[index] = { ...updatedRoute[index], location: value };
      setFormData({ ...formData, route: updatedRoute });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addRoute = () => {
    setFormData({
      ...formData,
      route: [...formData.route, { location: "", timestamp: new Date() }],
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    try {
      const response = await addShipment(formData); // Save to database
      console.log("Response:", response.data);
      navigate("/");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Container
      component={Paper}
      sx={{
        p: 4,
        maxWidth: 600,
        width: "100%",
        mt: 5,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        Create New Shipment
      </Typography>

      <form onSubmit={submitForm}>
        <TextField
          fullWidth
          label="Shipment ID"
          name="shipmentID"
          value={formData.shipmentID}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Container ID"
          name="containerID"
          value={formData.containerID}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />

        {formData.route.map((routeItem, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Route Location ${index + 1}`}
            name="location"
            value={routeItem.location}
            onChange={(e) => handleChange(e, index)}
            required
            sx={{ mb: 2 }}
          />
        ))}

        <Box sx={{ textAlign: "center", mb: 2 }}>
          <IconButton color="primary" onClick={addRoute}>
            <AddIcon />
          </IconButton>
          <Typography variant="body2" sx={{ display: "inline", ml: 1 }}>
            Add Route
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Current Location"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="ETA"
          type="datetime-local"
          name="currentETA"
          value={formData.currentETA}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          sx={{ mb: 3 }}
        >
          <MenuItem value="In Transit">In Transit</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Delayed">Delayed</MenuItem>
        </TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          sx={{ mt: 2, p: 1 }}
        >
          Submit Shipment
        </Button>
      </form>
    </Container>
  );
}
