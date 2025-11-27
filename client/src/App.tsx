import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import SetupPage from "@/pages/setup";
import WifiSetupPage from "@/pages/wifi-setup";
import CreateAccountPage from "@/pages/create-account";
import DashboardPage from "@/pages/dashboard"; // This acts as Detail View now
import NotificationsPage from "@/pages/notifications";
import LocationPage from "@/pages/location";
import AccountPage from "@/pages/account";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useWebSocket } from "@/lib/websocket";
import { useDataLoader } from "@/lib/use-data";

function Router() {
  const [location, setLocation] = useLocation();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  
  // Initialize WebSocket connection for real-time updates
  useWebSocket();
  
  // Load initial data from API
  useDataLoader();

  useEffect(() => {
    if (!isAuthenticated && location !== '/' && location !== '/wifi-setup' && location !== '/create-account') {
      setLocation('/');
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/create-account" component={CreateAccountPage} />
      <Route path="/wifi-setup" component={WifiSetupPage} />
      <Route path="/setup" component={SetupPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/device/:id" component={DashboardPage} />
      <Route path="/location" component={LocationPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/map" component={LocationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
