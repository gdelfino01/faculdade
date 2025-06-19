import React from 'react'
import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Sidebar from "./components/Sidebar";

import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

function App() {
  const authenticated = localStorage.getItem("user") !== null;
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {authenticated ? (
          <Sidebar>
            <Outlet />
          </Sidebar>
        ) : (
          <Outlet />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;