import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DashboardShell } from "./components/layout/dashboard-shell";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Header from "./components/Header";

import DashboardPage from "./pages/dashboard/page";
import PropertiesPage from "./pages/properties/page";
import ClientsPage from "./pages/clients/page";
import AppointmentsPage from "./pages/appointments/page";
import SalesPage from "./pages/sales/page";
import NotFound from "./pages/not-found";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <DashboardPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <PropertiesPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <ClientsPage />
              </DashboardShell>
            </ProtectedRoute>
        }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <AppointmentsPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <SalesPage />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;