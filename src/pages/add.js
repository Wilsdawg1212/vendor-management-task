// pages/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid2,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



export default function AddVendor() {
  const [vendor, setVendor] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    });
    if (res.ok) {
      router.push('/');
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Back button added. */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push('/')}
        variant="text"
        color="secondary"
        sx={{ mt: 4, mb: 1, display: 'flex', justifyContent: 'flex-start' }}
        >
          Back to Table
      </Button>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Vendor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: -2}}>
            {['name', 'contact', 'email', 'phone', 'address'].map((field) => (
                <TextField
                  fullWidth
                  required
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={vendor[field]}
                  onChange={handleChange}
                  sx={{ mt: 3}}
                />
            ))}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
              >
              Add Vendor
              </Button>
        </Box>
      </Paper>
    </Container>
  );
}
