import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { DashboardShell } from "./components/layout/dashboard-shell";

import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/dashboard/page";
import PropertiesPage from "./pages/properties/page";
import ClientsPage from "./pages/clients/page";
import AppointmentsPage from "./pages/appointments/page";
import SalesPage from "./pages/sales/page";
import NotFound from "./pages/not-found";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <DashboardShell>{children}</DashboardShell>;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <LoginPage />}
      </Route>

      <Route path="/dashboard">
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      </Route>

      <Route path="/properties">
        <PrivateRoute>
          <PropertiesPage />
        </PrivateRoute>
      </Route>

      <Route path="/clients">
        <PrivateRoute>
          <ClientsPage />
        </PrivateRoute>
      </Route>

      <Route path="/appointments">
        <PrivateRoute>
          <AppointmentsPage />
        </PrivateRoute>
      </Route>

      <Route path="/sales">
        <PrivateRoute>
          <SalesPage />
        </PrivateRoute>
      </Route>

      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;