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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">CRM GESP</h1>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to CRM GESP</h2>
              <p className="text-gray-600">Your comprehensive solution for property management.</p>
              
              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900">Properties</h3>
                  <p className="text-sm text-gray-500">Manage your real estate portfolio</p>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900">Clients</h3>
                  <p className="text-sm text-gray-500">Track client interactions</p>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                  <h3 className="text-lg font-medium text-gray-900">Sales</h3>
                  <p className="text-sm text-gray-500">Monitor your transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;