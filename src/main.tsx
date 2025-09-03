import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

const container = document.getElementById('root')!;
const queryClient = new QueryClient();

createRoot(container).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </LocalizationProvider>
  </React.StrictMode>,
);
