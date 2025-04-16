import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import DownloadIcon from '@mui/icons-material/Download';


export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleKeyDown = ( event ) => {
    // update search term
    // setSearchTerm()

  }

  useEffect(() => {
    // setSelectedVendors([..., searched vendors])
  }, [searchTerm]);

  useEffect(() => {
    fetch('/api/vendors')
      .then((res) => res.json())
      .then((data) => setVendors(data));
  }, []);

  const handleClickOpen = (id) => {
    setSelectedVendorId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVendorId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/vendors/${selectedVendorId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Remove the deleted vendor from the state
        setVendors(vendors.filter((vendor) => vendor.id !== selectedVendorId));
        //Add snackbar when a vendor is deleted
        setSnackbar({ open: true, message: 'Vendor deleted successfully' });
        handleClose();
      } else {
        console.error('Failed to delete the vendor.');
        // Optionally, handle error states here
      }
    } catch (error) {
      console.error('An error occurred while deleting the vendor:', error);
      // Optionally, handle error states here
    }
  };

  //Function to sort in a given order
  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredVendors = vendors.filter((v) =>
    [v.name, v.contact, v.email]
    .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    const key = sortConfig.key;
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
  
    const aValue = a[key];
    const bValue = b[key];
  
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * direction;
    } else {
      return (aValue > bValue ? 1 : -1) * direction;
    }
  });

  const paginatedVendors = sortedVendors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Contact', 'Email', 'Phone', 'Address', 'Category'];
    const rows = sortedVendors.map((v) => [
      v.id,
      v.name,
      v.contact,
      v.email,
      v.phone,
      v.address,
      v.category || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vendors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Vendor Management System
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSortConfig({ key: 'id', direction: 'asc' });
                setSearchTerm('');
                setPage(0);
              }}
              sx={{ mb: 2, ml: 1 }}
            >
            Reset Table View
            </Button>
            <Link href="/add" passHref>
              <Button variant="contained" color="primary" sx={{ mb: 2, ml: 1 }} justify-content="left">
                Add Vendor
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              sx={{ml: 2, }}
            >
              Export as CSV
            </Button>
          </Box>
          <TextField
            fullWidth
            placeholder="Search vendors by name, email, or contact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              {/* This below edit is to improve mobile experience */}
              <TableRow>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'name', label: 'Name' },
                  { key: 'contact', label: 'Contact' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'address', label: 'Address' },
                ].map((col) => (
                  <TableCell key={col.key}>
                    <Box
                      onClick={() => col.key !== 'id' && toggleSort(col.key)}
                      sx={{
                        cursor: col.key !== 'id' ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        userSelect: 'none',
                        py: 1,
                        width: 'fit-content',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 0.5 }}>
                        {col.label}
                      </Typography>
                      {sortConfig.key === col.key && col.key !== 'id' && (
                        <Typography variant="subtitle2" fontWeight="bold">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                ))}
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>{vendor.id}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.contact}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.address}</TableCell>
                  <TableCell>
                    <Link href={`/edit/${vendor.id}`} passHref>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </Button>
                    </Link>
                    <IconButton
                      color="secondary"
                      onClick={() => handleClickOpen(vendor.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedVendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No vendors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
            <TablePagination
            component="div"
            count={sortedVendors.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            />
        </TableContainer>

        {/* Confirmation Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Vendor"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this vendor? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Container>
    
  );
}
