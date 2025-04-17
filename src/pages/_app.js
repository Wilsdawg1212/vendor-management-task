import * as React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from "../components/Header";


const theme = createTheme({
  palette: {
    primary: {
      main: '#4a9f60',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8D6E63',
      light: '#BCAAA4',
      dark: '#5D4037',
      contrastText: '#fff',
    },
    background: {
      default: '#f1f8f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Geist", "Roboto", "Helvetica", "Arial", "sans-serif"',
    h4: {
    fontWeight: 600,
    marginBottom: '2rem',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: '2rem',
          paddingBottom: '2rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          marginTop: '1rem',
          marginBottom: '1rem',
          boxShadow: '0 8px 6px rgba(0,0,0,0.1)',

        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
  }
});

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <React.Fragment>
      <Head>
        <title>Vendor Management System</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
