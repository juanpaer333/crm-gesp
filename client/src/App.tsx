import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { DashboardShell } from "./components/layout/dashboard-shell";

import DashboardPage from "./pages/dashboard/page";
import PropertiesPage from "./pages/properties/page";
import ClientsPage from "./pages/clients/page";
import AppointmentsPage from "./pages/appointments/page";
import SalesPage from "./pages/sales/page";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/dashboard">
        <DashboardShell>
          <DashboardPage />
        </DashboardShell>
      </Route>

      <Route path="/properties">
        <DashboardShell>
          <PropertiesPage />
        </DashboardShell>
      </Route>

      <Route path="/clients">
        <DashboardShell>
          <ClientsPage />
        </DashboardShell>
      </Route>

      <Route path="/appointments">
        <DashboardShell>
          <AppointmentsPage />
        </DashboardShell>
      </Route>

      <Route path="/sales">
        <DashboardShell>
          <SalesPage />
        </DashboardShell>
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;