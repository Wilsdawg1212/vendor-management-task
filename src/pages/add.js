// pages/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Alert,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputMask from 'react-input-mask';




export default function AddVendor() {
  const [vendor, setVendor] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});


  const router = useRouter();

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;
  
    // Makes sure that the name element is filled
    if (!vendor.name.trim()) {
      newErrors.name = 'Name is required';
      hasError = true;
    }
  
    // Makes sure one of the contact forms is filled
    const hasSecondaryInfo =
      vendor.email.trim() ||
      vendor.phone.trim() ||
      vendor.address.trim();
  
    if (!hasSecondaryInfo) {
      newErrors.contact = ' ';
      newErrors.email = ' ';
      newErrors.phone = ' ';
      newErrors.address = ' ';
      hasError = true;
    }
  
    if (hasError) {
      setErrors(newErrors);
      return;
    }
  
    // Clear errors if all is valid
    setErrors({});

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
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Please complete the required fields. At least one method of contact is required.
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: -2}}>
            {['name', 'contact', 'email', 'address'].map((field) => (
                <TextField
                  fullWidth
                  required={field === 'name'}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={vendor[field]}
                  onChange={handleChange}
                  error={!!errors[field]}
                  helperText={errors[field]}
                  sx={{ mt: 3}}
                />
            ))}
            <InputMask
              //Might want to change this mask considering other countries have different phone numbers
              mask="(999) 999-9999"
              value={vendor.phone}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  required
                  margin="normal"
                  label="Phone"
                  name="phone"
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              )}
            </InputMask>
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
