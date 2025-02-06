import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import EnhancedTable from './ShipmentTable';

export default function Dashboard() {
  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          📊 Shipment Dashboard
        </Typography>
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          component={Link}
          to="/shipment-form"
          sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#135ba1" } }}
        >
          Add Shipment
        </Button>
      </Box>
     <EnhancedTable />
    </Container>
  );
}
